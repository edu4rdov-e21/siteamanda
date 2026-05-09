// Sync entre o progressStore (local, persistido em localStorage) e o Supabase.
// Estratégia: local-first.
//   - Login: pull do servidor; se servidor vazio, push do local (migração).
//   - Mudanças: push debounced do user_progress.
//   - Sessions: insert imediato a cada nova sessão detectada.
// Falhas de rede: catch silencioso por enquanto (próxima fase: outbox).

import { supabase } from './supabase';
import { useProgressStore } from '../store/progressStore';
import { emptyProgress } from './scoring';
import type { SessionRecord, UserProgress } from './types';

interface DbProgressRow {
  version: number;
  total_answered: number;
  total_correct: number;
  by_aula: UserProgress['byAula'];
  by_bloco: UserProgress['byBloco'];
  by_eixo: UserProgress['byEixo'];
  error_pool: string[];
  favorites: string[];
  created_at: string;
  updated_at: string;
}

interface DbSessionRow {
  id: string;
  user_id: string;
  started_at: string;
  finished_at: string;
  mode: SessionRecord['mode'];
  total: number;
  correct: number;
  answers: SessionRecord['answers'];
}

function fromDbProgress(row: DbProgressRow): Partial<UserProgress> {
  return {
    version: row.version as 1,
    totalAnswered: row.total_answered,
    totalCorrect: row.total_correct,
    byAula: row.by_aula ?? {},
    byBloco: row.by_bloco ?? {},
    byEixo: row.by_eixo ?? {},
    errorPool: row.error_pool ?? [],
    favorites: row.favorites ?? [],
    createdAt: row.created_at,
    lastUpdatedAt: row.updated_at,
  };
}

function toDbProgress(p: UserProgress, userId: string) {
  return {
    user_id: userId,
    version: p.version,
    total_answered: p.totalAnswered,
    total_correct: p.totalCorrect,
    by_aula: p.byAula,
    by_bloco: p.byBloco,
    by_eixo: p.byEixo,
    error_pool: p.errorPool,
    favorites: p.favorites,
  };
}

function fromDbSession(row: DbSessionRow): SessionRecord {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    mode: row.mode,
    total: row.total,
    correct: row.correct,
    answers: row.answers,
  };
}

let pushTimeout: ReturnType<typeof setTimeout> | null = null;
let unsubscribe: (() => void) | null = null;
let pushedSessionIds = new Set<string>();
let activeUserId: string | null = null;

export async function setupCloudSync(userId: string): Promise<void> {
  // Reset estado interno se trocou de usuário
  if (activeUserId && activeUserId !== userId) {
    teardownCloudSync();
  }
  activeUserId = userId;

  // 1) Pull do servidor
  const { data: row, error: progressErr } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (progressErr) {
    console.warn('[cloudSync] erro lendo user_progress:', progressErr.message);
  }

  const local = useProgressStore.getState();
  const localHasData = local.totalAnswered > 0;

  if (row) {
    // Servidor tem dados — é fonte de verdade. Hidrata o store.
    const merged: UserProgress = {
      ...emptyProgress(),
      ...fromDbProgress(row as DbProgressRow),
      history: local.history, // history vem da query separada abaixo
    };
    useProgressStore.setState(merged);

    // Puxa as últimas 50 sessions
    const { data: sessions, error: sessErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('finished_at', { ascending: false })
      .limit(50);
    if (sessErr) {
      console.warn('[cloudSync] erro lendo sessions:', sessErr.message);
    } else if (sessions) {
      const history = (sessions as DbSessionRow[]).map(fromDbSession);
      useProgressStore.setState({ history });
      pushedSessionIds = new Set(history.map((s) => s.id));
    }
  } else if (localHasData) {
    // Primeiro login, tem dados em localStorage → migra pra cloud.
    await pushProgressNow(userId);
    for (const s of local.history) {
      await insertSession(userId, s).catch((e) =>
        console.warn('[cloudSync] migration session insert falhou:', e),
      );
      pushedSessionIds.add(s.id);
    }
  } else {
    // Nada em lugar nenhum. Insere row vazio pro user (idempotente).
    await pushProgressNow(userId);
  }

  // 2) Inscreve-se em mudanças locais pra empurrar
  if (unsubscribe) unsubscribe();
  unsubscribe = useProgressStore.subscribe((state) => {
    if (activeUserId !== userId) return;

    // Empurra user_progress (debounced)
    schedulePush(userId);

    // Detecta novas sessions e insere imediatamente
    for (const s of state.history) {
      if (!pushedSessionIds.has(s.id)) {
        pushedSessionIds.add(s.id);
        void insertSession(userId, s).catch((e) =>
          console.warn('[cloudSync] session insert falhou:', e),
        );
      }
    }
  });
}

export function teardownCloudSync(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  if (pushTimeout) {
    clearTimeout(pushTimeout);
    pushTimeout = null;
  }
  pushedSessionIds = new Set();
  activeUserId = null;
}

function schedulePush(userId: string) {
  if (pushTimeout) clearTimeout(pushTimeout);
  pushTimeout = setTimeout(() => {
    void pushProgressNow(userId).catch((e) =>
      console.warn('[cloudSync] push falhou:', e),
    );
  }, 500);
}

async function pushProgressNow(userId: string): Promise<void> {
  const state = useProgressStore.getState();
  const { error } = await supabase
    .from('user_progress')
    .upsert(toDbProgress(state, userId));
  if (error) throw error;
}

async function insertSession(userId: string, s: SessionRecord): Promise<void> {
  const { error } = await supabase.from('sessions').insert({
    id: s.id,
    user_id: userId,
    started_at: s.startedAt,
    finished_at: s.finishedAt,
    mode: s.mode,
    total: s.total,
    correct: s.correct,
    answers: s.answers,
  });
  if (error) throw error;
}

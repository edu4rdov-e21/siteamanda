import { useParams } from 'react-router-dom';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question, SessionRecord, UserProgress } from '../lib/types';
import { applyAnswerToProgress, emptyProgress } from '../lib/scoring';
import { STORAGE_KEYS } from '../lib/storage';

interface ProgressState extends UserProgress {
  recordSession: (session: SessionRecord, questionsById: Record<string, Question>) => void;
  toggleFavorite: (questionId: string) => void;
  resetAll: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
}

type ProgressStore = UseBoundStore<StoreApi<ProgressState>>;

function makeProgressStore(persistKey: string): ProgressStore {
  return create<ProgressState>()(
    persist(
      (set, get) => ({
        ...emptyProgress(),

        recordSession: (session, questionsById) => {
          let prog: UserProgress = {
            version: get().version,
            createdAt: get().createdAt,
            lastUpdatedAt: get().lastUpdatedAt,
            totalAnswered: get().totalAnswered,
            totalCorrect: get().totalCorrect,
            byAula: get().byAula,
            byBloco: get().byBloco,
            byEixo: get().byEixo,
            errorPool: get().errorPool,
            favorites: get().favorites,
            history: get().history,
          };
          for (const a of session.answers) {
            if (a.selected === null) continue;
            const q = questionsById[a.questionId];
            if (!q) continue;
            prog = applyAnswerToProgress(prog, q, a);
          }
          const history = [session, ...prog.history].slice(0, 50);
          set({ ...prog, history });
        },

        toggleFavorite: (questionId) => {
          const cur = get().favorites;
          const next = cur.includes(questionId)
            ? cur.filter((id) => id !== questionId)
            : [...cur, questionId];
          set({ favorites: next, lastUpdatedAt: new Date().toISOString() });
        },

        resetAll: () => set({ ...emptyProgress() }),

        exportJSON: () => {
          const s = get();
          const payload: UserProgress = {
            version: s.version,
            createdAt: s.createdAt,
            lastUpdatedAt: s.lastUpdatedAt,
            totalAnswered: s.totalAnswered,
            totalCorrect: s.totalCorrect,
            byAula: s.byAula,
            byBloco: s.byBloco,
            byEixo: s.byEixo,
            errorPool: s.errorPool,
            favorites: s.favorites,
            history: s.history,
          };
          return JSON.stringify(payload, null, 2);
        },

        importJSON: (json) => {
          try {
            const parsed = JSON.parse(json) as UserProgress;
            if (parsed.version !== 1) return false;
            set({ ...parsed });
            return true;
          } catch {
            return false;
          }
        },
      }),
      {
        name: persistKey,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
}

// Um store por tema. Cada um persiste em chave separada do localStorage.
const stores: Record<string, ProgressStore> = {
  cirurgia: makeProgressStore(STORAGE_KEYS.progress), // chave legada, mantém compat
  otorrino: makeProgressStore(`${STORAGE_KEYS.progress}:otorrino`),
  oftalmo: makeProgressStore(`${STORAGE_KEYS.progress}:oftalmo`),
  edn: makeProgressStore(`${STORAGE_KEYS.progress}:edn`),
};

export function getProgressStore(temaSlug: string | undefined | null): ProgressStore {
  const slug = temaSlug && stores[temaSlug] ? temaSlug : 'cirurgia';
  return stores[slug];
}

/**
 * Hook que retorna o store de progresso do tema ativo (lido da URL).
 * Uso: const x = useProgressStore((s) => s.totalAnswered);
 * Mantém a mesma API do antigo useProgressStore.
 */
export function useProgressStore<T>(selector: (s: ProgressState) => T): T {
  const { tema } = useParams();
  const store = getProgressStore(tema);
  return store(selector);
}

/** Acesso fora de componente React. Caller passa o tema explicitamente. Default = cirurgia. */
useProgressStore.getState = (temaSlug?: string) => getProgressStore(temaSlug).getState();
useProgressStore.setState = (partial: Partial<ProgressState>, temaSlug?: string) =>
  getProgressStore(temaSlug).setState(partial);
useProgressStore.subscribe = (
  listener: (state: ProgressState, prevState: ProgressState) => void,
  temaSlug?: string,
) => getProgressStore(temaSlug).subscribe(listener);

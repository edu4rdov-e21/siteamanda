import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { AULAS } from '../data/meta/aulas';
import { BLOCOS, BLOCO_ORDER } from '../data/meta/blocos';
import { EIXOS, EIXO_ORDER } from '../data/meta/eixos';
import { aulasComQuestoes, eixosComQuestoes, loadAllQuestions } from '../data';
import { MODE_INFO, MODE_PRESETS } from '../lib/modes';
import { selectQuestions } from '../lib/questionSelector';
import { useQuizStore } from '../store/quizStore';
import { useProgressStore } from '../store/progressStore';
import type { BlocoId, Difficulty, EixoId, ModeKey } from '../lib/types';

const MODE_KEYS: ModeKey[] = [
  'aulaUnica',
  'bloco',
  'eixo',
  'tudo',
  'treino',
  'simulado',
  'revisaoErros',
  'marcadas',
];

const selectClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const labelClass = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300';

export function QuizSetupPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const startSession = useQuizStore((s) => s.startSession);
  const errorPoolCount = useProgressStore((s) => s.errorPool.length);
  const favoritesCount = useProgressStore((s) => s.favorites.length);

  const modeParam = (params.get('mode') ?? 'aulaUnica') as ModeKey;
  const mode: ModeKey = MODE_KEYS.includes(modeParam) ? modeParam : 'aulaUnica';
  const info = MODE_INFO[mode];

  const aulasDisponiveis = useMemo(() => aulasComQuestoes(), []);
  const eixosDisponiveis = useMemo(() => eixosComQuestoes(), []);

  const [aulaId, setAulaId] = useState<number | null>(aulasDisponiveis[0] ?? null);
  const [blocoId, setBlocoId] = useState<BlocoId>('A');
  const [eixoId, setEixoId] = useState<EixoId>(eixosDisponiveis[0] ?? 'T1');
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [count, setCount] = useState<number>(MODE_PRESETS[mode]().count);

  const sourceId: number | BlocoId | EixoId | undefined =
    mode === 'aulaUnica' ? (aulaId ?? undefined)
    : mode === 'bloco' ? blocoId
    : mode === 'eixo' ? eixoId
    : undefined;

  const availableCount = useMemo(() => {
    const all = loadAllQuestions();
    const probe = {
      ...MODE_PRESETS[mode](sourceId),
      count: 9999,
      difficulty,
      shuffleQuestions: false,
    };
    return selectQuestions(all, probe, useProgressStore.getState()).length;
  }, [mode, sourceId, difficulty, errorPoolCount, favoritesCount]);

  useEffect(() => {
    if (count > availableCount && availableCount > 0) {
      setCount(availableCount);
    }
  }, [availableCount, count]);

  const effectiveCount = Math.min(count, Math.max(availableCount, 1));

  const start = () => {
    if (availableCount === 0) return;

    const config = {
      ...MODE_PRESETS[mode](sourceId),
      count: effectiveCount,
      difficulty,
    };

    const all = loadAllQuestions();
    const pool = selectQuestions(all, config, useProgressStore.getState());

    startSession(config, pool);
    navigate('/cirurgia/quiz');
  };

  const showAulaPicker = mode === 'aulaUnica';
  const showBlocoPicker = mode === 'bloco';
  const showEixoPicker = mode === 'eixo';

  const errorPoolEmpty = mode === 'revisaoErros' && errorPoolCount === 0;
  const favoritesEmpty = mode === 'marcadas' && favoritesCount === 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Link
        to="/cirurgia"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{info.label}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{info.description}</p>
      </header>

      <div className="space-y-4">
        {showAulaPicker && (
          <Card>
            <label className={labelClass}>Aula</label>
            <select
              value={aulaId ?? ''}
              onChange={(e) => setAulaId(Number(e.target.value))}
              className={selectClass}
            >
              {aulasDisponiveis.map((id) => {
                const a = AULAS.find((x) => x.id === id);
                return (
                  <option key={id} value={id}>
                    {String(id).padStart(2, '0')} — {a?.titulo}
                  </option>
                );
              })}
            </select>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {aulasDisponiveis.length} aulas com questões disponíveis.
            </p>
          </Card>
        )}

        {showBlocoPicker && (
          <Card>
            <label className={labelClass}>Bloco</label>
            <select
              value={blocoId}
              onChange={(e) => setBlocoId(e.target.value as BlocoId)}
              className={selectClass}
            >
              {BLOCO_ORDER.map((id) => (
                <option key={id} value={id}>
                  {id} — {BLOCOS[id].nome}
                </option>
              ))}
            </select>
          </Card>
        )}

        {showEixoPicker && (
          <Card>
            <label className={labelClass}>Eixo transversal</label>
            <select
              value={eixoId}
              onChange={(e) => setEixoId(e.target.value as EixoId)}
              className={selectClass}
            >
              {EIXO_ORDER.map((id) => (
                <option key={id} value={id}>
                  {id} — {EIXOS[id].nome}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {eixosDisponiveis.length} eixo(s) com questões.
            </p>
          </Card>
        )}

        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'mixed')}
                className={selectClass}
              >
                <option value="mixed">Misturada</option>
                <option value="facil">Fácil</option>
                <option value="media">Média</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Nº de questões</label>
              <input
                type="number"
                min={1}
                max={Math.max(availableCount, 1)}
                value={effectiveCount}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setCount(Math.max(1, Math.min(availableCount || 1, v)));
                }}
                disabled={availableCount === 0}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {availableCount === 0
                  ? 'Nenhuma questão disponível para essa combinação.'
                  : `${availableCount} ${availableCount === 1 ? 'disponível' : 'disponíveis'} no banco para essa combinação.`}
              </p>
            </div>
          </div>
        </Card>

        {mode === 'simulado' && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulado: 60 minutos cronometrados, sem feedback imediato. Resultado aparece ao final.
          </p>
        )}

        {errorPoolEmpty && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Você ainda não tem questões marcadas como erradas. Faça outras sessões primeiro.
          </p>
        )}
        {favoritesEmpty && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Você ainda não marcou nenhuma questão. Marque com a estrela durante uma sessão.
          </p>
        )}

        <Button
          onClick={start}
          full
          disabled={errorPoolEmpty || favoritesEmpty || availableCount === 0}
        >
          Começar
        </Button>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Keyboard } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { AlternativeButton } from '../components/quiz/AlternativeButton';
import { ExplanationPanel } from '../components/quiz/ExplanationPanel';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { QuizProgress } from '../components/quiz/QuizProgress';
import { Timer } from '../components/quiz/Timer';
import { useQuizStore } from '../store/quizStore';
import { useProgressStore } from '../store/progressStore';

export function QuizPage() {
  const navigate = useNavigate();
  const config = useQuizStore((s) => s.config);
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const answers = useQuizStore((s) => s.answers);
  const startedAt = useQuizStore((s) => s.startedAt);
  const answer = useQuizStore((s) => s.answer);
  const next = useQuizStore((s) => s.next);
  const finishSession = useQuizStore((s) => s.finish);
  const abort = useQuizStore((s) => s.abort);

  const recordSession = useProgressStore((s) => s.recordSession);
  const favorites = useProgressStore((s) => s.favorites);
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite);

  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const current = questions[currentIndex];
  const recorded = current ? answers[current.id] : undefined;
  const immediate = config?.immediateFeedback ?? false;
  const reveal = immediate && !!recorded;
  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    setSelectedDraft(recorded?.selected ?? null);
  }, [currentIndex, recorded]);

  const questionsById = useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q])),
    [questions],
  );

  const handleFinish = useCallback(() => {
    const session = finishSession();
    recordSession(session, questionsById);
    navigate('/results');
  }, [finishSession, recordSession, questionsById, navigate]);

  const handleNext = useCallback(() => {
    if (isLast) handleFinish();
    else next();
  }, [isLast, handleFinish, next]);

  const handleSubmit = useCallback(() => {
    if (!current || selectedDraft === null) return;
    answer(current.id, selectedDraft);
    if (!immediate && isLast) handleFinish();
    else if (!immediate) next();
  }, [current, selectedDraft, answer, immediate, isLast, handleFinish, next]);

  const handleAbort = useCallback(() => {
    if (confirm('Sair da sessão? O progresso desta sessão será perdido.')) {
      abort();
      navigate('/');
    }
  }, [abort, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      // Ignore when modifier keys are pressed or when focused on input
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      // Letter selection: A-E
      const upper = e.key.toUpperCase();
      if (!reveal && ['A', 'B', 'C', 'D', 'E'].includes(upper)) {
        const exists = current.alternativas.find((a) => a.id === upper);
        if (exists) {
          e.preventDefault();
          setSelectedDraft(upper);
        }
        return;
      }

      // Number selection: 1-5
      if (!reveal && /^[1-5]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        const alt = current.alternativas[idx];
        if (alt) {
          e.preventDefault();
          setSelectedDraft(alt.id);
        }
        return;
      }

      // Enter: submit (if not revealed) or next (if revealed)
      if (e.key === 'Enter') {
        e.preventDefault();
        if (reveal) handleNext();
        else if (selectedDraft !== null) handleSubmit();
        return;
      }

      // F: toggle favorite (only when explanation is showing)
      if (upper === 'F' && reveal && config?.showExplanation) {
        e.preventDefault();
        toggleFavorite(current.id);
        return;
      }

      // Escape: abort
      if (e.key === 'Escape') {
        e.preventDefault();
        handleAbort();
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, reveal, selectedDraft, config, handleSubmit, handleNext, handleAbort, toggleFavorite]);

  if (!config || !current) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAbort}
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={16} /> Sair
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowShortcuts((s) => !s)}
            aria-label="Mostrar atalhos de teclado"
            aria-expanded={showShortcuts}
            className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:inline-flex"
          >
            <Keyboard size={14} />
            atalhos
          </button>
          {config.timeLimit && startedAt && (
            <Timer startedAt={startedAt} limitSeconds={config.timeLimit} onExpire={handleFinish} />
          )}
        </div>
      </header>

      {showShortcuts && (
        <div
          role="region"
          aria-label="Atalhos de teclado"
          className="mb-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <p className="mb-1 font-semibold">Atalhos</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            <li>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                A–E
              </kbd>{' '}
              ou{' '}
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                1–5
              </kbd>{' '}
              selecionar
            </li>
            <li>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                Enter
              </kbd>{' '}
              responder/próxima
            </li>
            <li>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">F</kbd>{' '}
              marcar p/ revisar
            </li>
            <li>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                Esc
              </kbd>{' '}
              sair
            </li>
          </ul>
        </div>
      )}

      <div className="mb-4">
        <QuizProgress current={currentIndex} total={questions.length} />
      </div>

      <Card key={currentIndex} className="space-y-5 animate-fade-in">
        <QuestionCard question={current} index={currentIndex} />

        <div className="space-y-2" role="radiogroup" aria-label="Alternativas">
          {current.alternativas.map((alt) => (
            <AlternativeButton
              key={alt.id}
              alternativa={alt}
              selected={
                reveal ? recorded?.selected === alt.id : selectedDraft === alt.id
              }
              revealed={reveal}
              isCorrect={current.respostaCorreta === alt.id}
              isAnswerCorrect={recorded?.correct ?? false}
              onClick={() => {
                if (reveal) return;
                setSelectedDraft(alt.id);
              }}
              disabled={reveal}
            />
          ))}
        </div>

        {reveal && config.showExplanation && (
          <div aria-live="polite" className="animate-slide-down">
            <ExplanationPanel
              question={current}
              isFavorite={favorites.includes(current.id)}
              onToggleFavorite={() => toggleFavorite(current.id)}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          {!reveal ? (
            <Button onClick={handleSubmit} disabled={selectedDraft === null}>
              {immediate ? 'Responder' : isLast ? 'Finalizar' : 'Próxima'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLast ? 'Ver resultado' : 'Próxima'}
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </Card>

      {!immediate && (
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          Modo simulado: feedback aparece apenas ao final.
        </p>
      )}

      {config.timeLimit === undefined && (
        <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
          <Link to="/" className="hover:text-slate-700 dark:hover:text-slate-300">
            Sair sem salvar
          </Link>
        </p>
      )}
    </div>
  );
}

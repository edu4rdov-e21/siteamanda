import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, RotateCw, XCircle } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { VideoMomentButton } from '../components/quiz/VideoMomentButton';
import { useQuizStore } from '../store/quizStore';
import { percent } from '../lib/scoring';

export function ResultsPage() {
  const navigate = useNavigate();
  const { tema = 'cirurgia' } = useParams();
  const lastSession = useQuizStore((s) => s.lastSession);
  const questions = useQuizStore((s) => s.questions);
  const reset = useQuizStore((s) => s.reset);

  const questionsById = useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q])),
    [questions],
  );

  if (!lastSession) return <Navigate to={`/${tema}`} replace />;

  const { total, correct, answers } = lastSession;
  const pct = percent(correct, total);
  const elapsedMs =
    new Date(lastSession.finishedAt).getTime() - new Date(lastSession.startedAt).getTime();
  const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <header className="mb-6 text-center">
        <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Resultado
        </p>
        <h1 className="mt-1 text-4xl font-semibold text-slate-900 dark:text-slate-100">{pct}%</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {correct} de {total} corretas — {elapsedMin} min
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <Button
          onClick={() => {
            reset();
            navigate(`/${tema}`);
          }}
        >
          <RotateCw size={16} />
          Novo quiz
        </Button>
        <Link to={`/${tema}/stats`}>
          <Button variant="secondary">Ver estatísticas</Button>
        </Link>
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Revisão
      </h2>
      <div className="space-y-3">
        {answers.map((a, i) => {
          const q = questionsById[a.questionId];
          if (!q) return null;
          const correctAlt = q.alternativas.find((alt) => alt.id === q.respostaCorreta);
          const userAlt = a.selected
            ? q.alternativas.find((alt) => alt.id === a.selected)
            : null;
          return (
            <Card key={a.questionId} className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">
                  {a.correct ? (
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="text-red-600 dark:text-red-400" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Questão {i + 1}</p>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">{q.enunciado}</p>
                </div>
              </div>
              <div className="space-y-1 pl-6 text-xs">
                {userAlt && !a.correct && (
                  <p className="text-red-700 dark:text-red-300">
                    <span className="font-semibold">Sua resposta:</span> {userAlt.id}.{' '}
                    {userAlt.texto}
                  </p>
                )}
                {a.selected === null && (
                  <p className="italic text-slate-500 dark:text-slate-400">Não respondida.</p>
                )}
                {correctAlt && (
                  <p className="text-emerald-700 dark:text-emerald-300">
                    <span className="font-semibold">Correta:</span> {correctAlt.id}.{' '}
                    {correctAlt.texto}
                  </p>
                )}
                {q.explicacao && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{q.explicacao}</p>
                )}
                <div className="pt-1">
                  <VideoMomentButton question={q} variant="compact" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

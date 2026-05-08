import type { Question } from '../../lib/types';

interface Props {
  question: Question;
  index: number;
}

const DIFFICULTY_LABEL = {
  facil: {
    label: 'Fácil',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  media: {
    label: 'Média',
    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  dificil: {
    label: 'Difícil',
    cls: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  },
} as const;

export function QuestionCard({ question, index }: Props) {
  const dif = DIFFICULTY_LABEL[question.dificuldade];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          #{index + 1}
        </span>
        <span className={`rounded-md px-2 py-0.5 font-medium ${dif.cls}`}>{dif.label}</span>
        {question.transversal && (
          <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Transversal
          </span>
        )}
      </div>
      <p className="text-base leading-relaxed text-slate-900 dark:text-slate-100">
        {question.enunciado}
      </p>
    </div>
  );
}

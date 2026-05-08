import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import type { Alternativa } from '../../lib/types';

interface Props {
  alternativa: Alternativa;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  isAnswerCorrect: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function AlternativeButton({
  alternativa,
  selected,
  revealed,
  isCorrect,
  isAnswerCorrect,
  onClick,
  disabled,
}: Props) {
  let stateClass =
    'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500';
  let icon = <Circle size={20} className="text-slate-400 dark:text-slate-500" />;

  if (revealed) {
    if (isCorrect) {
      stateClass =
        'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40';
      icon = <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
    } else if (selected && !isAnswerCorrect) {
      stateClass = 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/40';
      icon = <XCircle size={20} className="text-red-600 dark:text-red-400" />;
    } else {
      stateClass =
        'border-slate-200 bg-white opacity-70 dark:border-slate-700 dark:bg-slate-900';
    }
  } else if (selected) {
    stateClass = 'border-accent-600 bg-accent-50 dark:border-accent-500 dark:bg-accent-950/40';
    icon = <CheckCircle2 size={20} className="text-accent-600 dark:text-accent-400" />;
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${stateClass} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="flex-1">
        <span className="mr-2 font-semibold text-slate-700 dark:text-slate-300">
          {alternativa.id}.
        </span>
        <span className="text-slate-900 dark:text-slate-100">{alternativa.texto}</span>
      </span>
    </button>
  );
}

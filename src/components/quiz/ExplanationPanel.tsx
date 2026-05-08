import { Star } from 'lucide-react';
import type { Question } from '../../lib/types';

interface Props {
  question: Question;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ExplanationPanel({ question, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Explicação</h4>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remover dos marcados' : 'Marcar para revisar'}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Star
            size={14}
            className={
              isFavorite
                ? 'fill-amber-400 text-amber-500'
                : 'text-slate-400 dark:text-slate-500'
            }
          />
          {isFavorite ? 'Marcada' : 'Marcar p/ revisar'}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {question.explicacao}
      </p>
      {question.referenciaAula && (
        <blockquote className="border-l-2 border-slate-300 pl-3 text-xs italic text-slate-600 dark:border-slate-600 dark:text-slate-400">
          {question.referenciaAula}
        </blockquote>
      )}
    </div>
  );
}

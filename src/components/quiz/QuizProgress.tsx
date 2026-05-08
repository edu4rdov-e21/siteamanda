interface Props {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: Props) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          Questão {current + 1} de {total}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Questão ${current + 1} de ${total}`}
      >
        <div
          className="h-full bg-accent-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

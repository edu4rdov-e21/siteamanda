import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  startedAt: number;
  limitSeconds: number;
  onExpire: () => void;
}

export function Timer({ startedAt, limitSeconds, onExpire }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = Math.max(0, limitSeconds - elapsed);

  useEffect(() => {
    if (remaining === 0) onExpire();
  }, [remaining, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const danger = remaining < 60;

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`Tempo restante ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors ${
        danger
          ? 'bg-red-100 text-red-700 animate-pulse-soft dark:bg-red-950/50 dark:text-red-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      <Clock size={14} />
      <span className="tabular-nums">
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </div>
  );
}

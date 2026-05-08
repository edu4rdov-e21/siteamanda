import { Play } from 'lucide-react';
import { AULA_BY_ID } from '../../data/meta/aulas';
import { buildVideoUrl } from '../../data/meta/playlist';
import type { Question } from '../../lib/types';

interface Props {
  question: Question;
  variant?: 'default' | 'compact';
}

function fmtTimestamp(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function VideoMomentButton({ question, variant = 'default' }: Props) {
  const aulaId = question.videoAulaId;
  const startSec = question.videoStartSec;
  if (aulaId === undefined || startSec === undefined) return null;
  const aula = AULA_BY_ID(aulaId);
  if (!aula?.videoId) return null;

  const url = buildVideoUrl(aula.videoId, startSec);
  const label = `Conferir no vídeo (${fmtTimestamp(startSec)})`;
  const fullLabel = question.transversal
    ? `${label} — Aula ${String(aulaId).padStart(2, '0')}`
    : label;

  const compact = variant === 'compact';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir vídeo da Aula ${aulaId} no YouTube em ${fmtTimestamp(startSec)}`}
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
        compact
          ? 'px-2 py-1 text-xs text-accent-700 hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-950/40'
          : 'border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs text-accent-700 hover:bg-accent-100 dark:border-accent-800 dark:bg-accent-950/40 dark:text-accent-300 dark:hover:bg-accent-950/60'
      }`}
    >
      <Play size={12} className="fill-current" />
      <span>{fullLabel}</span>
    </a>
  );
}

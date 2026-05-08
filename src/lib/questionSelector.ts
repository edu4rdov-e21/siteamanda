import type { BlocoId, EixoId, ModeConfig, Question, UserProgress } from './types';

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shuffleAlternatives(q: Question): Question {
  const alternativas = shuffle(q.alternativas);
  return { ...q, alternativas };
}

export function selectQuestions(
  allQuestions: Question[],
  config: ModeConfig,
  progress: UserProgress,
): Question[] {
  let pool: Question[];

  switch (config.source) {
    case 'aula':
      pool = allQuestions.filter((q) => q.aulaOrigem === config.sourceId);
      break;
    case 'bloco':
      pool = allQuestions.filter((q) => q.blocos.includes(config.sourceId as BlocoId));
      break;
    case 'eixo':
      pool = allQuestions.filter((q) => q.eixos.includes(config.sourceId as EixoId));
      break;
    case 'errors': {
      const set = new Set(progress.errorPool);
      pool = allQuestions.filter((q) => set.has(q.id));
      break;
    }
    case 'favorites': {
      const set = new Set(progress.favorites);
      pool = allQuestions.filter((q) => set.has(q.id));
      break;
    }
    case 'all':
    case 'custom':
    default:
      pool = [...allQuestions];
  }

  if (config.difficulty && config.difficulty !== 'mixed') {
    pool = pool.filter((q) => q.dificuldade === config.difficulty);
  }

  if (config.shuffleQuestions) pool = shuffle(pool);

  pool = pool.slice(0, config.count);

  if (config.shuffleAlternatives) pool = pool.map(shuffleAlternatives);

  return pool;
}

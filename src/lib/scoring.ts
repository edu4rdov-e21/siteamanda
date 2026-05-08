import type { AnswerRecord, Difficulty, Question, UserProgress } from './types';

export function emptyProgress(): UserProgress {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    lastUpdatedAt: now,
    totalAnswered: 0,
    totalCorrect: 0,
    byAula: {},
    byBloco: {},
    byEixo: {},
    errorPool: [],
    favorites: [],
    history: [],
  };
}

const emptyByDifficulty = (): Record<Difficulty, { answered: number; correct: number }> => ({
  facil: { answered: 0, correct: 0 },
  media: { answered: 0, correct: 0 },
  dificil: { answered: 0, correct: 0 },
});

export function applyAnswerToProgress(
  progress: UserProgress,
  question: Question,
  answer: AnswerRecord,
): UserProgress {
  const next: UserProgress = {
    ...progress,
    lastUpdatedAt: new Date().toISOString(),
    totalAnswered: progress.totalAnswered + 1,
    totalCorrect: progress.totalCorrect + (answer.correct ? 1 : 0),
    byAula: { ...progress.byAula },
    byBloco: { ...progress.byBloco },
    byEixo: { ...progress.byEixo },
    errorPool: [...progress.errorPool],
  };

  if (question.aulaOrigem !== null) {
    const cur = next.byAula[question.aulaOrigem] ?? {
      answered: 0,
      correct: 0,
      byDifficulty: emptyByDifficulty(),
    };
    const byDif = { ...cur.byDifficulty };
    const dif = byDif[question.dificuldade];
    byDif[question.dificuldade] = {
      answered: dif.answered + 1,
      correct: dif.correct + (answer.correct ? 1 : 0),
    };
    next.byAula[question.aulaOrigem] = {
      answered: cur.answered + 1,
      correct: cur.correct + (answer.correct ? 1 : 0),
      byDifficulty: byDif,
    };
  }

  for (const b of question.blocos) {
    const cur = next.byBloco[b] ?? { answered: 0, correct: 0 };
    next.byBloco[b] = {
      answered: cur.answered + 1,
      correct: cur.correct + (answer.correct ? 1 : 0),
    };
  }
  for (const e of question.eixos) {
    const cur = next.byEixo[e] ?? { answered: 0, correct: 0 };
    next.byEixo[e] = {
      answered: cur.answered + 1,
      correct: cur.correct + (answer.correct ? 1 : 0),
    };
  }

  if (!answer.correct && !next.errorPool.includes(question.id)) {
    next.errorPool.push(question.id);
  } else if (answer.correct) {
    const idx = next.errorPool.indexOf(question.id);
    if (idx >= 0) next.errorPool.splice(idx, 1);
  }

  return next;
}

export function percent(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

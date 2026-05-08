import { create } from 'zustand';
import type { AnswerRecord, ModeConfig, Question, SessionRecord } from '../lib/types';
import { uuid } from '../lib/scoring';

interface QuizState {
  config: ModeConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
  startedAt: number | null;
  questionStartedAt: number | null;
  finished: boolean;
  lastSession: SessionRecord | null;

  startSession: (config: ModeConfig, pool: Question[]) => void;
  answer: (questionId: string, selected: string) => void;
  next: () => void;
  goTo: (index: number) => void;
  abort: () => void;
  finish: () => SessionRecord;
  reset: () => void;
}

const initial: Pick<
  QuizState,
  | 'config'
  | 'questions'
  | 'currentIndex'
  | 'answers'
  | 'startedAt'
  | 'questionStartedAt'
  | 'finished'
  | 'lastSession'
> = {
  config: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  startedAt: null,
  questionStartedAt: null,
  finished: false,
  lastSession: null,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...initial,

  startSession: (config, pool) => {
    const now = Date.now();
    set({
      config,
      questions: pool,
      currentIndex: 0,
      answers: {},
      startedAt: now,
      questionStartedAt: now,
      finished: false,
      lastSession: null,
    });
  },

  answer: (questionId, selected) => {
    const { questions, answers, questionStartedAt } = get();
    const q = questions.find((qq) => qq.id === questionId);
    if (!q) return;
    const correct = q.respostaCorreta === selected;
    const timeSpentMs = questionStartedAt ? Date.now() - questionStartedAt : 0;
    set({
      answers: {
        ...answers,
        [questionId]: { questionId, selected, correct, timeSpentMs },
      },
    });
  },

  next: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1, questionStartedAt: Date.now() });
    }
  },

  goTo: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index, questionStartedAt: Date.now() });
    }
  },

  abort: () => {
    set({ ...initial });
  },

  finish: () => {
    const { config, questions, answers, startedAt } = get();
    const finishedAt = new Date().toISOString();
    const startedAtIso = startedAt ? new Date(startedAt).toISOString() : finishedAt;
    const answersList: AnswerRecord[] = questions.map(
      (q) => answers[q.id] ?? { questionId: q.id, selected: null, correct: false, timeSpentMs: 0 },
    );
    const correct = answersList.filter((a) => a.correct).length;
    const session: SessionRecord = {
      id: uuid(),
      startedAt: startedAtIso,
      finishedAt,
      mode: config!,
      total: questions.length,
      correct,
      answers: answersList,
    };
    set({ finished: true, lastSession: session });
    return session;
  },

  reset: () => set({ ...initial }),
}));

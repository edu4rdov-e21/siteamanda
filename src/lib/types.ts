export type Difficulty = 'facil' | 'media' | 'dificil';
export type QuestionType = 'multipla' | 'verdadeiro_falso' | 'caso_clinico';

export type BlocoId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type EixoId = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8';

export interface Alternativa {
  id: string;
  texto: string;
}

export interface Question {
  id: string;
  aulaOrigem: number | null;
  blocos: BlocoId[];
  eixos: EixoId[];
  tags: string[];
  dificuldade: Difficulty;
  tipo: QuestionType;
  enunciado: string;
  alternativas: Alternativa[];
  respostaCorreta: string;
  explicacao: string;
  referenciaAula?: string;
  transversal: boolean;
}

export interface Aula {
  id: number;
  titulo: string;
  blocoPrincipal: BlocoId;
  blocosSecundarios: BlocoId[];
  eixos: EixoId[];
  arquivoQuestoes: string;
}

export interface Bloco {
  id: BlocoId;
  nome: string;
  aulas: number[];
}

export interface Eixo {
  id: EixoId;
  nome: string;
  aulas: number[];
}

export type SourceType =
  | 'aula'
  | 'bloco'
  | 'eixo'
  | 'all'
  | 'errors'
  | 'favorites'
  | 'custom';

export interface ModeConfig {
  source: SourceType;
  sourceId?: number | BlocoId | EixoId;
  count: number;
  difficulty?: Difficulty | 'mixed';
  shuffleQuestions: boolean;
  immediateFeedback: boolean;
  showExplanation: boolean;
  timeLimit?: number;
}

export type ModeKey =
  | 'aulaUnica'
  | 'bloco'
  | 'eixo'
  | 'tudo'
  | 'simulado'
  | 'treino'
  | 'revisaoErros'
  | 'marcadas';

export interface AnswerRecord {
  questionId: string;
  selected: string | null;
  correct: boolean;
  timeSpentMs: number;
}

export interface SessionRecord {
  id: string;
  startedAt: string;
  finishedAt: string;
  mode: ModeConfig;
  total: number;
  correct: number;
  answers: AnswerRecord[];
}

export interface AulaStats {
  answered: number;
  correct: number;
  byDifficulty: Record<Difficulty, { answered: number; correct: number }>;
}

export interface BlocoStats {
  answered: number;
  correct: number;
}

export interface EixoStats {
  answered: number;
  correct: number;
}

export interface UserProgress {
  version: 1;
  createdAt: string;
  lastUpdatedAt: string;
  totalAnswered: number;
  totalCorrect: number;
  byAula: Record<number, AulaStats>;
  byBloco: Record<string, BlocoStats>;
  byEixo: Record<string, EixoStats>;
  errorPool: string[];
  favorites: string[];
  history: SessionRecord[];
}

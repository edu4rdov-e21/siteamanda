import type { BlocoId, EixoId, ModeConfig, ModeKey } from './types';

const baseDefaults = {
  difficulty: 'mixed' as const,
  shuffleQuestions: true,
  shuffleAlternatives: true,
};

export const MODE_PRESETS: Record<ModeKey, (sourceId?: number | BlocoId | EixoId) => ModeConfig> = {
  aulaUnica: (aulaId) => ({
    ...baseDefaults,
    source: 'aula',
    sourceId: aulaId,
    count: 10,
    immediateFeedback: true,
    showExplanation: true,
  }),
  bloco: (blocoId) => ({
    ...baseDefaults,
    source: 'bloco',
    sourceId: blocoId,
    count: 15,
    immediateFeedback: true,
    showExplanation: true,
  }),
  eixo: (eixoId) => ({
    ...baseDefaults,
    source: 'eixo',
    sourceId: eixoId,
    count: 10,
    immediateFeedback: true,
    showExplanation: true,
  }),
  tudo: () => ({
    ...baseDefaults,
    source: 'all',
    count: 20,
    immediateFeedback: true,
    showExplanation: true,
  }),
  treino: () => ({
    ...baseDefaults,
    source: 'all',
    count: 15,
    immediateFeedback: true,
    showExplanation: true,
  }),
  simulado: () => ({
    ...baseDefaults,
    source: 'all',
    count: 30,
    immediateFeedback: false,
    showExplanation: false,
    timeLimit: 60 * 60,
  }),
  revisaoErros: () => ({
    ...baseDefaults,
    source: 'errors',
    count: 20,
    immediateFeedback: true,
    showExplanation: true,
  }),
  marcadas: () => ({
    ...baseDefaults,
    source: 'favorites',
    count: 20,
    immediateFeedback: true,
    showExplanation: true,
  }),
};

export const MODE_INFO: Record<
  ModeKey,
  { label: string; description: string; needsSetup: boolean }
> = {
  aulaUnica: { label: 'Aula única', description: '10 questões de uma aula específica', needsSetup: true },
  bloco: { label: 'Bloco temático', description: '15 questões de um bloco', needsSetup: true },
  eixo: { label: 'Eixo transversal', description: '10 questões cruzando aulas', needsSetup: true },
  tudo: { label: 'Tudo embaralhado', description: '20 questões aleatórias do banco', needsSetup: false },
  treino: { label: 'Treino', description: '15 questões com feedback imediato', needsSetup: false },
  simulado: { label: 'Simulado', description: '30 questões em 60 min, sem feedback', needsSetup: false },
  revisaoErros: { label: 'Revisão de erros', description: 'Refaz questões que você errou', needsSetup: false },
  marcadas: { label: 'Marcadas', description: 'Revisita questões favoritadas', needsSetup: false },
};

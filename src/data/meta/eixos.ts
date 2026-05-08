import type { Eixo, EixoId } from '../../lib/types';

export const EIXOS: Record<EixoId, Eixo> = {
  T1: { id: 'T1', nome: 'Diferencial dos 4 abdomes agudos', aulas: [1, 11, 13, 14, 7] },
  T2: { id: 'T2', nome: 'Hemorragia digestiva: alta × baixa', aulas: [8, 9] },
  T3: { id: 'T3', nome: 'Perioperatório integrado', aulas: [3, 4, 5, 16, 17, 23] },
  T4: { id: 'T4', nome: 'Aterosclerose como doença sistêmica', aulas: [11, 18, 25] },
  T5: { id: 'T5', nome: 'Choque e ressuscitação', aulas: [8, 11, 14, 4] },
  T6: { id: 'T6', nome: 'Oncologia cirúrgica: estadiamento e margens', aulas: [6, 10, 15, 20] },
  T7: { id: 'T7', nome: 'Vias aéreas e tórax cirúrgico', aulas: [6, 12, 24] },
  T8: { id: 'T8', nome: 'Homem >60 multissintomático', aulas: [18, 19, 22, 26, 25] },
};

export const EIXO_ORDER: EixoId[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];

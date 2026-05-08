import type { Bloco, BlocoId } from '../../lib/types';

export const BLOCOS: Record<BlocoId, Bloco> = {
  A: { id: 'A', nome: 'Abdome Agudo', aulas: [1, 13, 14, 11, 7] },
  B: { id: 'B', nome: 'Hemorragia Digestiva', aulas: [8, 9] },
  C: { id: 'C', nome: 'Perioperatório', aulas: [3, 4, 5, 16, 17, 23] },
  D: { id: 'D', nome: 'Pediatria Cirúrgica', aulas: [2, 7, 21] },
  E: { id: 'E', nome: 'Tórax', aulas: [6, 12, 24] },
  F: { id: 'F', nome: 'Vascular', aulas: [11, 25] },
  G: { id: 'G', nome: 'Oncologia Cirúrgica', aulas: [10, 15, 20, 6] },
  H: { id: 'H', nome: 'Urologia', aulas: [18, 19, 20, 21, 22, 26] },
};

export const BLOCO_ORDER: BlocoId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

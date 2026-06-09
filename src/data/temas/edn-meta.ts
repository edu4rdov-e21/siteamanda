import type { Aula, Bloco, BlocoId } from '../../lib/types';

// IDs internos do Eduardo Nota Dez. EDP = Provas (bloco único).
export const EDN_BLOCO_PROVAS = 'EDP' as BlocoId;

export const EDN_BLOCOS: Record<string, Bloco> = {
  EDP: { id: EDN_BLOCO_PROVAS, nome: 'Prova Final 15/06', aulas: [1, 2, 3] },
};

export const EDN_BLOCO_ORDER: BlocoId[] = [EDN_BLOCO_PROVAS];

// Não há playlist do YouTube (tema sem aulas em vídeo).
export const EDN_PLAYLIST_ID = '';

// "Aulas" aqui correspondem às disciplinas da prova final.
export const EDN_AULAS: Aula[] = [
  { id: 1, titulo: 'Economia, Política e Sociedade',         blocoPrincipal: 'EDP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '01-economia' },
  { id: 2, titulo: 'Gestão da Informação e do Conhecimento', blocoPrincipal: 'EDP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '02-gic' },
  { id: 3, titulo: 'Gestão da Qualidade',                    blocoPrincipal: 'EDP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '03-gq' },
];

export const EDN_AULA_BY_ID = (id: number) => EDN_AULAS.find((a) => a.id === id);

import type { Aula, Bloco, BlocoId } from '../../lib/types';

// IDs internos da oftalmologia, não colidem com cirurgia (A-H) nem otorrino (OP/OS).
export const OFTALMO_BLOCO_PROPEDEUTICA = 'OFP' as BlocoId;
export const OFTALMO_BLOCO_DOENCAS = 'OFD' as BlocoId;
export const OFTALMO_BLOCO_PEDIATRIA = 'OFK' as BlocoId;

export const OFTALMO_BLOCOS: Record<string, Bloco> = {
  OFP: { id: OFTALMO_BLOCO_PROPEDEUTICA, nome: 'Propedêutica e Refração', aulas: [4, 5] },
  OFD: {
    id: OFTALMO_BLOCO_DOENCAS,
    nome: 'Doenças e Sintomas',
    aulas: [1, 2, 3, 6, 7, 8, 10],
  },
  OFK: { id: OFTALMO_BLOCO_PEDIATRIA, nome: 'Pediatria Oftalmológica', aulas: [9] },
};

export const OFTALMO_BLOCO_ORDER: BlocoId[] = [
  OFTALMO_BLOCO_PROPEDEUTICA,
  OFTALMO_BLOCO_DOENCAS,
  OFTALMO_BLOCO_PEDIATRIA,
];

export const OFTALMO_PLAYLIST_ID = 'PLE0NmHF9nlUD3brt6rP7wL1PeF6Q_j2oZ';

// Aula 01 (Urgências em oftalmologia, ID QmQvV8DTvnw) está age-restricted no YouTube.
// Por enquanto não tem questões — quando o user fornecer fonte, adiciona aqui.
export const OFTALMO_AULAS: Aula[] = [
  { id: 2,  titulo: 'Olho Vermelho',                                  blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '02-olho-vermelho',           videoId: '7BlbUGRwPwM' },
  { id: 3,  titulo: 'Catarata',                                       blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '03-catarata',                 videoId: 'BqxFaQWqx38' },
  { id: 4,  titulo: 'Eu Uso Óculos',                                  blocoPrincipal: 'OFP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '04-eu-uso-oculos',            videoId: 'RtkMdpB8hH8' },
  { id: 5,  titulo: 'Propedêutica Ocular',                            blocoPrincipal: 'OFP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '05-propedeutica-ocular',      videoId: 'r41V1njcJhY' },
  { id: 6,  titulo: 'Neurologia e Oftalmologia',                      blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '06-neuro-oftalmo',            videoId: 'IM0vYqjwylA' },
  { id: 7,  titulo: 'Glaucoma',                                       blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '07-glaucoma',                 videoId: 'Qhua0DoMklk' },
  { id: 8,  titulo: 'Manifestações Oculares em Doenças Sistêmicas',   blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '08-manifestacoes-sistemicas', videoId: 'rLg-eav0BMI' },
  { id: 9,  titulo: 'Oftalmologia Pediátrica',                        blocoPrincipal: 'OFK' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '09-pediatria',                videoId: 'KmaBB727ALs' },
  { id: 10, titulo: 'Retina',                                         blocoPrincipal: 'OFD' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '10-retina',                   videoId: 'DashITj9wCc' },
];

export const OFTALMO_AULA_BY_ID = (id: number) => OFTALMO_AULAS.find((a) => a.id === id);

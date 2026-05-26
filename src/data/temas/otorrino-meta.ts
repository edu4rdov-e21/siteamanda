import type { Aula, Bloco, BlocoId } from '../../lib/types';

// Otorrino usa um set diferente de blocos. Reaproveitamos o tipo BlocoId
// mas com IDs próprios prefixados ('OP'=Propedêutica, 'OS'=Sintomas).
// Pra não conflitar com cirurgia, mapeamos pros chars não usados.
// Cirurgia usa A-H. Otorrino usa I, J (cabem como BlocoId via cast).

// IDs internos da otorrino — strings que não colidem com cirurgia
export const OTORRINO_BLOCO_PROPEDEUTICA = 'OP' as BlocoId;
export const OTORRINO_BLOCO_SINTOMAS = 'OS' as BlocoId;

export const OTORRINO_BLOCOS: Record<string, Bloco> = {
  OP: { id: OTORRINO_BLOCO_PROPEDEUTICA, nome: 'Propedêutica', aulas: [1, 3, 4, 5, 7] },
  OS: {
    id: OTORRINO_BLOCO_SINTOMAS,
    nome: 'Sintomas e Doenças',
    aulas: [2, 6, 8, 9, 10, 11, 12, 13],
  },
};

export const OTORRINO_BLOCO_ORDER: BlocoId[] = [
  OTORRINO_BLOCO_PROPEDEUTICA,
  OTORRINO_BLOCO_SINTOMAS,
];

export const OTORRINO_PLAYLIST_ID = 'PLE0NmHF9nlUD9WA_UY0k7m1B4SZ1R6StR';

export const OTORRINO_AULAS: Aula[] = [
  { id: 1, titulo: 'Propedêutica em Cabeça e Pescoço', blocoPrincipal: 'OP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '01-cabeca-pescoco', videoId: 'Db_UHEhoYZk' },
  { id: 2, titulo: 'Disfagia',                          blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '02-disfagia',       videoId: 'wvGe_YoAu6Y' },
  { id: 3, titulo: 'Propedêutica em Laringologia',      blocoPrincipal: 'OP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '03-laringologia',   videoId: 'ITcFDiB5mBM' },
  { id: 4, titulo: 'Propedêutica em Otologia',          blocoPrincipal: 'OP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '04-otologia',       videoId: 'QbgUiIBsvLA' },
  { id: 5, titulo: 'Propedêutica em Otoneurologia',     blocoPrincipal: 'OP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '05-otoneurologia',  videoId: 'ZTDw6SJIH3s' },
  { id: 6, titulo: 'Zumbido',                           blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '06-zumbido',        videoId: 'DD_INPGkDp0' },
  { id: 7, titulo: 'Propedêutica em Rinologia',         blocoPrincipal: 'OP' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '07-rinologia',     videoId: 'sgL-ppzc6Z0' },
  { id: 8, titulo: 'Otopatias Externas',                blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '08-otopatias-externas',           videoId: 'sRIvFuweui4' },
  { id: 9, titulo: 'Otites Médias',                     blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '09-otites-medias',                videoId: 'OLi2zu1rLzc' },
  { id: 10, titulo: 'Patologias Inflamatórias da Faringe', blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '10-faringe-inflamatorias',    videoId: 'Oot-DMGbto0' },
  { id: 11, titulo: 'Ronco e Apneia',                   blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '11-ronco-apneia',                 videoId: 'y6dZ0Gbxli4' },
  { id: 12, titulo: 'Obstrução Nasal',                  blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '12-obstrucao-nasal',              videoId: '21vDaUfBQp4' },
  { id: 13, titulo: 'Massas Cervicais',                 blocoPrincipal: 'OS' as BlocoId, blocosSecundarios: [], eixos: [], arquivoQuestoes: '13-massas-cervicais',             videoId: 'Z0IundjxRek' },
];

export const OTORRINO_AULA_BY_ID = (id: number) => OTORRINO_AULAS.find((a) => a.id === id);

import { useParams } from 'react-router-dom';
import type { Aula, Bloco, BlocoId, Eixo, EixoId, Question } from '../../lib/types';

// Cirurgia
import { AULAS as CIRURGIA_AULAS, AULA_BY_ID as CIRURGIA_AULA_BY_ID } from '../meta/aulas';
import { BLOCOS as CIRURGIA_BLOCOS, BLOCO_ORDER as CIRURGIA_BLOCO_ORDER } from '../meta/blocos';
import { EIXOS as CIRURGIA_EIXOS, EIXO_ORDER as CIRURGIA_EIXO_ORDER } from '../meta/eixos';
import { PLAYLIST_ID as CIRURGIA_PLAYLIST_ID } from '../meta/playlist';
import {
  loadAllQuestions as cirurgiaLoadAll,
  loadAulaQuestions as cirurgiaLoadAula,
  loadEixoQuestions as cirurgiaLoadEixo,
  aulasComQuestoes as cirurgiaAulasComQuestoes,
  eixosComQuestoes as cirurgiaEixosComQuestoes,
} from '../index';

// Otorrino
import {
  OTORRINO_AULAS,
  OTORRINO_AULA_BY_ID,
  OTORRINO_BLOCOS,
  OTORRINO_BLOCO_ORDER,
  OTORRINO_PLAYLIST_ID,
} from './otorrino-meta';
import {
  loadAllOtorrinoQuestions,
  loadOtorrinoAulaQuestions,
  loadOtorrinoEixoQuestions,
  otorrinoAulasComQuestoes,
  otorrinoEixosComQuestoes,
} from '../otorrino-index';

export type TemaSlug = 'cirurgia' | 'otorrino';

export interface TemaData {
  slug: TemaSlug;
  AULAS: Aula[];
  AULA_BY_ID: (id: number) => Aula | undefined;
  BLOCOS: Record<string, Bloco>;
  BLOCO_ORDER: BlocoId[];
  EIXOS: Record<string, Eixo>;
  EIXO_ORDER: EixoId[];
  PLAYLIST_ID: string;
  loadAllQuestions: () => Question[];
  loadAulaQuestions: (aulaId: number) => Question[];
  loadEixoQuestions: (eixoId: EixoId) => Question[];
  aulasComQuestoes: () => number[];
  eixosComQuestoes: () => EixoId[];
}

const cirurgia: TemaData = {
  slug: 'cirurgia',
  AULAS: CIRURGIA_AULAS,
  AULA_BY_ID: CIRURGIA_AULA_BY_ID,
  BLOCOS: CIRURGIA_BLOCOS,
  BLOCO_ORDER: CIRURGIA_BLOCO_ORDER,
  EIXOS: CIRURGIA_EIXOS,
  EIXO_ORDER: CIRURGIA_EIXO_ORDER,
  PLAYLIST_ID: CIRURGIA_PLAYLIST_ID,
  loadAllQuestions: cirurgiaLoadAll,
  loadAulaQuestions: cirurgiaLoadAula,
  loadEixoQuestions: cirurgiaLoadEixo,
  aulasComQuestoes: cirurgiaAulasComQuestoes,
  eixosComQuestoes: cirurgiaEixosComQuestoes,
};

const otorrino: TemaData = {
  slug: 'otorrino',
  AULAS: OTORRINO_AULAS,
  AULA_BY_ID: OTORRINO_AULA_BY_ID,
  BLOCOS: OTORRINO_BLOCOS,
  BLOCO_ORDER: OTORRINO_BLOCO_ORDER,
  EIXOS: {},
  EIXO_ORDER: [],
  PLAYLIST_ID: OTORRINO_PLAYLIST_ID,
  loadAllQuestions: loadAllOtorrinoQuestions,
  loadAulaQuestions: loadOtorrinoAulaQuestions,
  loadEixoQuestions: loadOtorrinoEixoQuestions,
  aulasComQuestoes: otorrinoAulasComQuestoes,
  eixosComQuestoes: otorrinoEixosComQuestoes,
};

const TEMAS_MAP: Record<TemaSlug, TemaData> = {
  cirurgia,
  otorrino,
};

export function getTemaData(slug: string | undefined | null): TemaData {
  if (slug && slug in TEMAS_MAP) return TEMAS_MAP[slug as TemaSlug];
  return cirurgia; // default seguro
}

/** Hook que lê o slug do tema na URL e retorna os dados/loaders. */
export function useTemaData(): TemaData {
  const { tema } = useParams();
  return getTemaData(tema);
}

/** Aula da OUTRA aula com a videoId — usado por VideoMomentButton que pode receber questão de qualquer tema. */
export function aulaByIdAcrossTemas(aulaId: number, temaSlug?: string): Aula | undefined {
  if (temaSlug) {
    return getTemaData(temaSlug).AULA_BY_ID(aulaId);
  }
  // Fallback: tenta cirurgia, depois otorrino
  return CIRURGIA_AULA_BY_ID(aulaId) ?? OTORRINO_AULA_BY_ID(aulaId);
}

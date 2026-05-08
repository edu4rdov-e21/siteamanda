import type { EixoId, Question } from '../lib/types';

import aula01 from './aulas/01-obstrucao-intestinal.json';
import aula02 from './aulas/02-alarme-rn.json';
import aula03 from './aulas/03-antibioticoterapia.json';
import aula04 from './aulas/04-pos-operatorio.json';
import aula05 from './aulas/05-pre-operatorio.json';
import aula06 from './aulas/06-nodulos-pulmonares.json';
import aula07 from './aulas/07-dor-abdominal-infancia.json';
import aula08 from './aulas/08-hda.json';
import aula09 from './aulas/09-hdb.json';
import aula10 from './aulas/10-neoplasia-pele.json';
import aula11 from './aulas/11-oclusao-arterial.json';
import aula12 from './aulas/12-traqueostomia.json';
import aula13 from './aulas/13-abdome-inflamatorio.json';
import aula14 from './aulas/14-abdome-perfurativo.json';
import aula15 from './aulas/15-cancer-colorretal.json';
import aula16 from './aulas/16-cicatrizacao.json';
import aula17 from './aulas/17-nutricao.json';
import aula18 from './aulas/18-disfuncao-eretil.json';
import aula19 from './aulas/19-hipogonadismo.json';
import aula20 from './aulas/20-urooncologia.json';
import aula21 from './aulas/21-urologia-pediatrica.json';
import aula22 from './aulas/22-stui-prostata.json';
import aula23 from './aulas/23-ferida-cirurgica.json';
import aula24 from './aulas/24-derrames-pleurais.json';
import aula25 from './aulas/25-iac.json';
import aula26 from './aulas/26-calculo-renal.json';

import eixo01 from './transversais/eixo-1-abdome-agudo.json';
import eixo02 from './transversais/eixo-2-hemorragia-digestiva.json';
import eixo03 from './transversais/eixo-3-perioperatorio.json';
import eixo04 from './transversais/eixo-4-aterosclerose.json';
import eixo05 from './transversais/eixo-5-choque.json';
import eixo06 from './transversais/eixo-6-oncologia-cirurgica.json';
import eixo07 from './transversais/eixo-7-vias-aereas-torax.json';
import eixo08 from './transversais/eixo-8-homem-60.json';

interface AulaFile {
  aulaId: number;
  titulo: string;
  questoes: Question[];
}

interface EixoFile {
  eixoId: EixoId;
  titulo: string;
  questoes: Question[];
}

const AULA_FILES: AulaFile[] = [
  aula01, aula02, aula03, aula04, aula05, aula06, aula07, aula08, aula09, aula10,
  aula11, aula12, aula13, aula14, aula15, aula16, aula17, aula18, aula19, aula20,
  aula21, aula22, aula23, aula24, aula25, aula26,
] as AulaFile[];

const EIXO_FILES: EixoFile[] = [
  eixo01, eixo02, eixo03, eixo04, eixo05, eixo06, eixo07, eixo08,
] as EixoFile[];

export function loadAllQuestions(): Question[] {
  const aulaQs = AULA_FILES.flatMap((f) => f.questoes);
  const eixoQs = EIXO_FILES.flatMap((f) => f.questoes);
  return [...aulaQs, ...eixoQs];
}

export function loadAulaQuestions(aulaId: number): Question[] {
  const file = AULA_FILES.find((f) => f.aulaId === aulaId);
  return file?.questoes ?? [];
}

export function loadEixoQuestions(eixoId: EixoId): Question[] {
  const file = EIXO_FILES.find((f) => f.eixoId === eixoId);
  return file?.questoes ?? [];
}

export function aulasComQuestoes(): number[] {
  return AULA_FILES.map((f) => f.aulaId);
}

export function eixosComQuestoes(): EixoId[] {
  return EIXO_FILES.map((f) => f.eixoId);
}

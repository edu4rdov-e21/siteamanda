import type { EixoId, Question } from '../lib/types';

import aula02 from './aulas-oftalmo/02-olho-vermelho.json';
import aula03 from './aulas-oftalmo/03-catarata.json';
import aula04 from './aulas-oftalmo/04-eu-uso-oculos.json';
import aula05 from './aulas-oftalmo/05-propedeutica-ocular.json';
import aula06 from './aulas-oftalmo/06-neuro-oftalmo.json';
import aula07 from './aulas-oftalmo/07-glaucoma.json';
import aula08 from './aulas-oftalmo/08-manifestacoes-sistemicas.json';
import aula09 from './aulas-oftalmo/09-pediatria.json';
import aula10 from './aulas-oftalmo/10-retina.json';

interface AulaFile {
  aulaId: number;
  titulo: string;
  questoes: Question[];
}

const AULA_FILES: AulaFile[] = [
  aula02, aula03, aula04, aula05, aula06, aula07, aula08, aula09, aula10,
] as AulaFile[];

export function loadAllOftalmoQuestions(): Question[] {
  return AULA_FILES.flatMap((f) => f.questoes);
}

export function loadOftalmoAulaQuestions(aulaId: number): Question[] {
  const file = AULA_FILES.find((f) => f.aulaId === aulaId);
  return file?.questoes ?? [];
}

export function loadOftalmoEixoQuestions(_eixoId: EixoId): Question[] {
  return [];
}

export function oftalmoAulasComQuestoes(): number[] {
  return AULA_FILES.filter((f) => f.questoes.length > 0).map((f) => f.aulaId);
}

export function oftalmoEixosComQuestoes(): EixoId[] {
  return [];
}

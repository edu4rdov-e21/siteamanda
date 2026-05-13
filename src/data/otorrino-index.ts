import type { EixoId, Question } from '../lib/types';

import aula01 from './aulas-otorrino/01-cabeca-pescoco.json';
import aula02 from './aulas-otorrino/02-disfagia.json';
import aula03 from './aulas-otorrino/03-laringologia.json';
import aula04 from './aulas-otorrino/04-otologia.json';
import aula05 from './aulas-otorrino/05-otoneurologia.json';
import aula06 from './aulas-otorrino/06-zumbido.json';
import aula07 from './aulas-otorrino/07-rinologia.json';

interface AulaFile {
  aulaId: number;
  titulo: string;
  questoes: Question[];
}

const AULA_FILES: AulaFile[] = [
  aula01, aula02, aula03, aula04, aula05, aula06, aula07,
] as AulaFile[];

export function loadAllOtorrinoQuestions(): Question[] {
  return AULA_FILES.flatMap((f) => f.questoes);
}

export function loadOtorrinoAulaQuestions(aulaId: number): Question[] {
  const file = AULA_FILES.find((f) => f.aulaId === aulaId);
  return file?.questoes ?? [];
}

export function loadOtorrinoEixoQuestions(_eixoId: EixoId): Question[] {
  // Otorrino não tem eixos transversais por enquanto.
  return [];
}

export function otorrinoAulasComQuestoes(): number[] {
  return AULA_FILES.filter((f) => f.questoes.length > 0).map((f) => f.aulaId);
}

export function otorrinoEixosComQuestoes(): EixoId[] {
  return [];
}

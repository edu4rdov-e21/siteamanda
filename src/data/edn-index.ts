import type { EixoId, Question } from '../lib/types';

import aula01 from './aulas-edn/01-economia.json';
import aula02 from './aulas-edn/02-gic.json';
import aula03 from './aulas-edn/03-gq.json';

interface AulaFile {
  aulaId: number;
  titulo: string;
  questoes: Question[];
}

const AULA_FILES: AulaFile[] = [aula01, aula02, aula03] as AulaFile[];

export function loadAllEdnQuestions(): Question[] {
  return AULA_FILES.flatMap((f) => f.questoes);
}

export function loadEdnAulaQuestions(aulaId: number): Question[] {
  const file = AULA_FILES.find((f) => f.aulaId === aulaId);
  return file?.questoes ?? [];
}

export function loadEdnEixoQuestions(_eixoId: EixoId): Question[] {
  return [];
}

export function ednAulasComQuestoes(): number[] {
  return AULA_FILES.filter((f) => f.questoes.length > 0).map((f) => f.aulaId);
}

export function ednEixosComQuestoes(): EixoId[] {
  return [];
}

import type { Aula } from '../../lib/types';

export const AULAS: Aula[] = [
  { id: 1, titulo: 'Abdome Agudo Obstrução Intestinal', blocoPrincipal: 'A', blocosSecundarios: [], eixos: ['T1'], arquivoQuestoes: '01-obstrucao-intestinal' },
  { id: 2, titulo: 'Alarme Cirúrgico no Recém-Nascido', blocoPrincipal: 'D', blocosSecundarios: [], eixos: [], arquivoQuestoes: '02-alarme-rn' },
  { id: 3, titulo: 'Antibioticoterapia e Infecção em Cirurgia', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3'], arquivoQuestoes: '03-antibioticoterapia' },
  { id: 4, titulo: 'Avaliação Pós-Operatória', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3', 'T5'], arquivoQuestoes: '04-pos-operatorio' },
  { id: 5, titulo: 'Avaliação Pré-Operatória', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3'], arquivoQuestoes: '05-pre-operatorio' },
  { id: 6, titulo: 'Diagnóstico e Investigação de Nódulos Pulmonares', blocoPrincipal: 'E', blocosSecundarios: ['G'], eixos: ['T6', 'T7'], arquivoQuestoes: '06-nodulos-pulmonares' },
  { id: 7, titulo: 'Dor Abdominal Aguda na Infância', blocoPrincipal: 'D', blocosSecundarios: ['A'], eixos: ['T1'], arquivoQuestoes: '07-dor-abdominal-infancia' },
  { id: 8, titulo: 'Hemorragia Digestiva Alta', blocoPrincipal: 'B', blocosSecundarios: [], eixos: ['T2', 'T5'], arquivoQuestoes: '08-hda' },
  { id: 9, titulo: 'Hemorragia Digestiva Baixa', blocoPrincipal: 'B', blocosSecundarios: [], eixos: ['T2'], arquivoQuestoes: '09-hdb' },
  { id: 10, titulo: 'Neoplasia de Pele', blocoPrincipal: 'G', blocosSecundarios: [], eixos: ['T6'], arquivoQuestoes: '10-neoplasia-pele' },
  { id: 11, titulo: 'Oclusão Arterial Aguda', blocoPrincipal: 'F', blocosSecundarios: ['A'], eixos: ['T1', 'T4', 'T5'], arquivoQuestoes: '11-oclusao-arterial' },
  { id: 12, titulo: 'Traqueostomia', blocoPrincipal: 'E', blocosSecundarios: [], eixos: ['T7'], arquivoQuestoes: '12-traqueostomia' },
  { id: 13, titulo: 'Abdome Agudo Inflamatório', blocoPrincipal: 'A', blocosSecundarios: [], eixos: ['T1'], arquivoQuestoes: '13-abdome-inflamatorio' },
  { id: 14, titulo: 'Abdome Agudo Perfurativo', blocoPrincipal: 'A', blocosSecundarios: [], eixos: ['T1', 'T5'], arquivoQuestoes: '14-abdome-perfurativo' },
  { id: 15, titulo: 'Câncer Colorretal', blocoPrincipal: 'G', blocosSecundarios: [], eixos: ['T6'], arquivoQuestoes: '15-cancer-colorretal' },
  { id: 16, titulo: 'Cicatrização de Feridas', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3'], arquivoQuestoes: '16-cicatrizacao' },
  { id: 17, titulo: 'Nutrição em Cirurgia', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3'], arquivoQuestoes: '17-nutricao' },
  { id: 18, titulo: 'Fisiologia da Ereção e Disfunção Erétil', blocoPrincipal: 'H', blocosSecundarios: [], eixos: ['T4', 'T8'], arquivoQuestoes: '18-disfuncao-eretil' },
  { id: 19, titulo: 'Hipogonadismo', blocoPrincipal: 'H', blocosSecundarios: [], eixos: ['T8'], arquivoQuestoes: '19-hipogonadismo' },
  { id: 20, titulo: 'Urooncologia', blocoPrincipal: 'H', blocosSecundarios: ['G'], eixos: ['T6'], arquivoQuestoes: '20-urooncologia' },
  { id: 21, titulo: 'Urologia Pediátrica', blocoPrincipal: 'D', blocosSecundarios: ['H'], eixos: [], arquivoQuestoes: '21-urologia-pediatrica' },
  { id: 22, titulo: 'STUI e Doenças de Próstata', blocoPrincipal: 'H', blocosSecundarios: [], eixos: ['T8'], arquivoQuestoes: '22-stui-prostata' },
  { id: 23, titulo: 'Cuidados com a Ferida Cirúrgica', blocoPrincipal: 'C', blocosSecundarios: [], eixos: ['T3'], arquivoQuestoes: '23-ferida-cirurgica' },
  { id: 24, titulo: 'Derrames Pleurais e Drenagem de Tórax', blocoPrincipal: 'E', blocosSecundarios: [], eixos: ['T7'], arquivoQuestoes: '24-derrames-pleurais' },
  { id: 25, titulo: 'Insuficiência Arterial Crônica', blocoPrincipal: 'F', blocosSecundarios: [], eixos: ['T4', 'T8'], arquivoQuestoes: '25-iac' },
  { id: 26, titulo: 'Cálculo Renal', blocoPrincipal: 'H', blocosSecundarios: [], eixos: ['T8'], arquivoQuestoes: '26-calculo-renal' },
];

export const AULA_BY_ID = (id: number) => AULAS.find((a) => a.id === id);

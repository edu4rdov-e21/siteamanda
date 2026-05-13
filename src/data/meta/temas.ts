export interface Tema {
  id: string;
  nome: string;
  descricao: string;
  /** Slug usado nas URLs: /{slug}, /{slug}/setup, etc. */
  slug: string;
  /** Total aproximado de questões (atualizado manualmente quando adicionar conteúdo). */
  questoes: number;
  /** Se false, o card aparece como "Em breve" e não navega. */
  ativo: boolean;
  /** Cor de acento opcional (futuro: temas com paleta própria). */
  cor?: string;
}

export const TEMAS: Tema[] = [
  {
    id: 'cirurgia',
    nome: 'Cirurgia',
    descricao: '26 aulas, 600 questões',
    slug: 'cirurgia',
    questoes: 600,
    ativo: true,
  },
  {
    id: 'otorrino',
    nome: 'Otorrinolaringologia',
    descricao: 'Em breve',
    slug: 'otorrino',
    questoes: 0,
    ativo: false,
  },
];

export const TEMA_BY_SLUG = (slug: string) => TEMAS.find((t) => t.slug === slug);

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
  /** Se true, o card NÃO aparece no seletor de matérias — só acessível via link direto. */
  oculto?: boolean;
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
    descricao: '13 aulas, 260 questões',
    slug: 'otorrino',
    questoes: 260,
    ativo: true,
  },
  {
    id: 'oftalmo',
    nome: 'Oftalmologia',
    descricao: '9 aulas, 180 questões',
    slug: 'oftalmo',
    questoes: 180,
    ativo: true,
  },
  {
    id: 'edn',
    nome: 'Eduardo Nota Dez',
    descricao: 'Prova final 15/06 · 60 questões',
    slug: 'edn',
    questoes: 60,
    ativo: true,
    oculto: true,
  },
];

export const TEMA_BY_SLUG = (slug: string) => TEMAS.find((t) => t.slug === slug);

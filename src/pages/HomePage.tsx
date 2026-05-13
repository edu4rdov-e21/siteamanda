import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  GitMerge,
  Shuffle,
  Dumbbell,
  Timer as TimerIcon,
  RotateCcw,
  Star,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Card } from '../components/shared/Card';
import { useTemaData } from '../data/temas';
import { TEMA_BY_SLUG } from '../data/meta/temas';
import { MODE_INFO } from '../lib/modes';
import type { ModeKey } from '../lib/types';

const ICONS: Record<ModeKey, typeof BookOpen> = {
  aulaUnica: BookOpen,
  bloco: Layers,
  eixo: GitMerge,
  tudo: Shuffle,
  treino: Dumbbell,
  simulado: TimerIcon,
  revisaoErros: RotateCcw,
  marcadas: Star,
};

const MODE_ORDER: ModeKey[] = [
  'aulaUnica',
  'simulado',
  'treino',
  'eixo',
  'bloco',
  'tudo',
  'revisaoErros',
  'marcadas',
];

export function HomePage() {
  const tema = useTemaData();
  const meta = TEMA_BY_SLUG(tema.slug);
  const nomeAmigavel = meta?.nome ?? tema.slug;
  const descricao = meta?.descricao ?? '';

  // Esconde eixo se o tema não tem
  const modes = MODE_ORDER.filter((m) => m !== 'eixo' || tema.EIXO_ORDER.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Trocar matéria
      </Link>

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          {nomeAmigavel}
        </h1>
        {descricao && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{descricao}</p>
        )}
      </header>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Escolha um modo
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modes.map((mode) => {
            const info = MODE_INFO[mode];
            const Icon = ICONS[mode];
            return (
              <Link
                key={mode}
                to={`/${tema.slug}/setup?mode=${mode}`}
                className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <Card className="h-full transition-colors group-hover:border-accent-500 dark:group-hover:border-accent-500">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-accent-50 p-2 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {info.label}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          to={`/${tema.slug}/stats`}
          className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Card className="flex items-center gap-3 transition-colors hover:border-accent-500 dark:hover:border-accent-500">
            <BarChart3 size={18} className="text-slate-700 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Estatísticas
            </span>
          </Card>
        </Link>
        <Link
          to="/settings"
          className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Card className="flex items-center gap-3 transition-colors hover:border-accent-500 dark:hover:border-accent-500">
            <SettingsIcon size={18} className="text-slate-700 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Ajustes</span>
          </Card>
        </Link>
      </section>
    </div>
  );
}

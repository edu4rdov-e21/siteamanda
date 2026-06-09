import { Link } from 'react-router-dom';
import {
  Scissors,
  Ear,
  Eye,
  Lock,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/shared/Card';
import { TEMAS, type Tema } from '../data/meta/temas';

const ICONS: Record<string, typeof Scissors> = {
  cirurgia: Scissors,
  otorrino: Ear,
  oftalmo: Eye,
};

function TemaCard({ tema }: { tema: Tema }) {
  const Icon = ICONS[tema.id] ?? Scissors;

  if (!tema.ativo) {
    return (
      <Card className="relative cursor-not-allowed opacity-60">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {tema.nome}
              </h3>
              <Lock size={12} className="text-slate-400" />
            </div>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{tema.descricao}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link
      to={`/${tema.slug}`}
      className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <Card className="h-full transition-colors group-hover:border-accent-500 dark:group-hover:border-accent-500">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-accent-50 p-2 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {tema.nome}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{tema.descricao}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function TemaSelectorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Quiz
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Escolha uma matéria pra começar.
        </p>
      </header>

      <section className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TEMAS.filter((t) => !t.oculto).map((t) => (
            <TemaCard key={t.id} tema={t} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          to="/stats"
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

      {/* Easter egg: jogo da Amanda */}
      <div className="mt-8 text-center">
        <a
          href="/amanda-medicina/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700 transition-colors hover:border-pink-400 hover:bg-pink-100 dark:border-pink-900/60 dark:bg-pink-950/30 dark:text-pink-300 dark:hover:bg-pink-950/60"
        >
          <Sparkles size={12} />
          clique para uma surpresa
        </a>
      </div>
    </div>
  );
}

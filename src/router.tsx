import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { TemaSelectorPage } from './pages/TemaSelectorPage';
import { HomePage } from './pages/HomePage';
import { QuizSetupPage } from './pages/QuizSetupPage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { LoginPage } from './pages/LoginPage';
import { RequireAuth } from './components/shared/RequireAuth';
import { AUTH_ENABLED } from './lib/supabase';

const StatsPage = lazy(() =>
  import('./pages/StatsPage').then((m) => ({ default: m.StatsPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);

function PageLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
      Carregando…
    </div>
  );
}

const wrap = (el: ReactNode) => <Suspense fallback={<PageLoading />}>{el}</Suspense>;
const guard = (el: ReactNode) =>
  AUTH_ENABLED ? <RequireAuth>{el}</RequireAuth> : el;

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: guard(<TemaSelectorPage />) },

  // Cirurgia (tema atual). Demais temas futuros seguem o mesmo padrão.
  { path: '/cirurgia', element: guard(<HomePage />) },
  { path: '/cirurgia/setup', element: guard(<QuizSetupPage />) },
  { path: '/cirurgia/quiz', element: guard(<QuizPage />) },
  { path: '/cirurgia/results', element: guard(<ResultsPage />) },

  // Stats e Settings ficam globais por enquanto (compartilhados entre temas).
  { path: '/stats', element: guard(wrap(<StatsPage />)) },
  { path: '/settings', element: guard(wrap(<SettingsPage />)) },

  // Compat: rotas antigas redirecionam pro tema cirurgia
  { path: '/setup', element: <Navigate to="/cirurgia/setup" replace /> },
  { path: '/quiz', element: <Navigate to="/cirurgia/quiz" replace /> },
  { path: '/results', element: <Navigate to="/cirurgia/results" replace /> },

  { path: '*', element: <Navigate to="/" replace /> },
]);

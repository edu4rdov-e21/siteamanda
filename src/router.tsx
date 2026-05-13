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
  { path: '/settings', element: guard(wrap(<SettingsPage />)) },

  // Tema dinâmico (cirurgia, otorrino, futuros…)
  { path: '/:tema', element: guard(<HomePage />) },
  { path: '/:tema/setup', element: guard(<QuizSetupPage />) },
  { path: '/:tema/quiz', element: guard(<QuizPage />) },
  { path: '/:tema/results', element: guard(<ResultsPage />) },
  { path: '/:tema/stats', element: guard(wrap(<StatsPage />)) },

  // Compat: rotas antigas sem tema redirecionam pra cirurgia
  { path: '/setup', element: <Navigate to="/cirurgia/setup" replace /> },
  { path: '/quiz', element: <Navigate to="/cirurgia/quiz" replace /> },
  { path: '/results', element: <Navigate to="/cirurgia/results" replace /> },
  { path: '/stats', element: <Navigate to="/cirurgia/stats" replace /> },

  { path: '*', element: <Navigate to="/" replace /> },
]);

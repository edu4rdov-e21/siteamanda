import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuizSetupPage } from './pages/QuizSetupPage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';

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

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/setup', element: <QuizSetupPage /> },
  { path: '/quiz', element: <QuizPage /> },
  { path: '/results', element: <ResultsPage /> },
  { path: '/stats', element: wrap(<StatsPage />) },
  { path: '/settings', element: wrap(<SettingsPage />) },
  { path: '*', element: <Navigate to="/" replace /> },
]);

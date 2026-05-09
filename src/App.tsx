import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useSettingsStore } from './store/settingsStore';
import { useAuthStore } from './store/authStore';

export default function App() {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return <RouterProvider router={router} />;
}

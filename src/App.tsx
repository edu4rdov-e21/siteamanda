import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useSettingsStore } from './store/settingsStore';

export default function App() {
  const darkMode = useSettingsStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  return <RouterProvider router={router} />;
}

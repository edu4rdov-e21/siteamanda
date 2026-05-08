import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      setDarkMode: (v) => set({ darkMode: v }),
    }),
    {
      name: 'quiz-cirurgia:settings:v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

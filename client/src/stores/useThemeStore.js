import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      isLightMode: false,
      toggleTheme: () => set((state) => {
        const newTheme = !state.isLightMode;
        if (newTheme) {
          document.documentElement.classList.add('light-mode');
        } else {
          document.documentElement.classList.remove('light-mode');
        }
        return { isLightMode: newTheme };
      }),
      // Initialize class on load based on persisted state
      initTheme: () => set((state) => {
        if (state.isLightMode) {
          document.documentElement.classList.add('light-mode');
        } else {
          document.documentElement.classList.remove('light-mode');
        }
        return state;
      })
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.initTheme();
      }
    }
  )
);

export default useThemeStore;

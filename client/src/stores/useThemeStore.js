import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isLightMode: false,
  toggleTheme: () => set((state) => {
    const newTheme = !state.isLightMode;
    if (newTheme) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    return { isLightMode: newTheme };
  })
}));

export default useThemeStore;

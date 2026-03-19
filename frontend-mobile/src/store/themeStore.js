import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useThemeStore = create((set) => ({
  dark: false,

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved === 'dark') set({ dark: true });
  },

  toggleTheme: async () => {
    set((state) => {
      const next = !state.dark;
      AsyncStorage.setItem('theme', next ? 'dark' : 'light');
      return { dark: next };
    });
  },

  setDark: async (val) => {
    await AsyncStorage.setItem('theme', val ? 'dark' : 'light');
    set({ dark: val });
  },
}));

export default useThemeStore;
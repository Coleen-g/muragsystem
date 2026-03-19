import { create } from 'zustand';

const useThemeStore = create((set) => ({
  dark: localStorage.getItem('theme') === 'dark',
  setDark: (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', val);
    set({ dark: val });
  },
  toggle: () => {
    const next = localStorage.getItem('theme') !== 'dark';
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    set({ dark: next });
  },
}));

export default useThemeStore;
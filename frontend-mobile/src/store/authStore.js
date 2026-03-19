import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: async () => {
    console.log('logout called');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
    console.log('logout done');
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (token && user) set({ user, token });
  },
}));

export default useAuthStore;
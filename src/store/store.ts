import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createSafeStorage = () => {
  const storage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    ? window.localStorage
    : {
        getItem: (_name: string) => null,
        setItem: (_name: string, _value: string) => {},
        removeItem: (_name: string) => {},
      };

  return {
    getItem: (name: string) => {
      try {
        return storage.getItem(name);
      } catch (error) {
        console.warn('Unable to read persisted state:', error);
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        storage.setItem(name, value);
      } catch (error) {
        console.warn('Unable to persist state:', error);
      }
    },
    removeItem: (name: string) => {
      try {
        storage.removeItem(name);
      } catch (error) {
        console.warn('Unable to remove persisted state:', error);
      }
    },
  };
};

interface AppState {
  theme: 'light' | 'dark';
  favorites: string[];
  recents: string[];
  toggleTheme: () => void;
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  addRecent: (toolId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      favorites: [],
      recents: [],
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      addFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites
            : [...state.favorites, toolId],
        })),
      removeFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== toolId),
        })),
      addRecent: (toolId) =>
        set((state) => {
          const recents = [toolId, ...state.recents.filter((id) => id !== toolId)].slice(0, 10);
          return { recents };
        }),
    }),
    {
      name: 'daily-tools-hub-storage',
      storage: createSafeStorage(),
    }
  )
);
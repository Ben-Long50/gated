import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type mapFavoriteStore = {
  favorites: string[];
  tab: string;

  addFavorite: (path: string) => void;
  removeFavorite: (path: string) => void;
  hasPath: (path: string) => boolean;

  setTab: (tab: string) => void;
};

const useMapFavoriteStore = create<mapFavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      tab: 'tiles',

      addFavorite: (path) =>
        set((state) => ({
          favorites: state.favorites.includes(path)
            ? state.favorites
            : [...state.favorites, path],
        })),

      removeFavorite: (path) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p !== path),
        })),

      hasPath: (path) => get().favorites.includes(path),

      setTab: (tab) => set({ tab }),
    }),
    {
      name: 'mapFavorites',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);

export default useMapFavoriteStore;

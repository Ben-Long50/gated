import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type mapFavoriteStore = {
  favorites: string[];
  addFavorite: (path: string) => void;
  removeFavorite: (path: string) => void;
  hasPath: (path: string) => boolean;
};

const useMapFavoriteStore = create<mapFavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

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
    }),
    {
      name: 'mapFavorites',
    },
  ),
);

export default useMapFavoriteStore;

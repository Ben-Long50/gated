import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PathData = { path: string; key: string };

type RouteHistoryState = {
  history: PathData[];
  backgroundData: PathData | null;
  push: (data: PathData) => void;
  setBackgroundData: () => void;
  resetBackgroundData: () => void;
  getRouteDelta: (data: PathData) => number;
};

const useRouteHistoryStore = create<RouteHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      backgroundData: null,
      push: (data) =>
        set((state) => ({
          history: [...state.history.slice(0, 50), data],
        })),
      setBackgroundData: () => {
        const history = get().history;

        set({
          backgroundData: history[history.length - 2],
        });
      },
      resetBackgroundData: () => set({ backgroundData: null }),
      getRouteDelta: (data) => {
        const history = get().history;
        const backgroundData = get().backgroundData;

        const currentIndex = history.findIndex((d) => d.key === data.key);

        const backgroundIndex = backgroundData
          ? history.findIndex((d) => d.key === backgroundData.key)
          : null;

        const delta = backgroundIndex ? backgroundIndex - currentIndex : 0;

        return delta || -1;
      },
    }),
    {
      name: 'routeHistory',
      partialize: (state) => ({
        history: state.history,
        backgroundData: state.backgroundData,
      }),
    },
  ),
);

export default useRouteHistoryStore;

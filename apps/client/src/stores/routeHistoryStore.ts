import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RouteHistoryState = {
  history: string[];
  push: (path: string) => void;
  getLastRoute: () => string | null;
};

const useRouteHistoryStore = create<RouteHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      push: (path) =>
        set((state) => ({
          history: [path, ...state.history.filter((p) => p !== path)].slice(
            0,
            10,
          ),
        })),

      getLastRoute: () => {
        const history = get().history;
        return history.length > 1 ? history[1] : null;
      },
    }),
    {
      name: 'routeHistory',
      partialize: (state) => ({ history: state.history }),
    },
  ),
);

export default useRouteHistoryStore;

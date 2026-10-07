import { create } from 'zustand';

type ModalNavigationState = {
  backgroundPath: string | null;
  history: string[];

  start: (backgroundPath: string) => void;
  push: (path: string) => void;
  reset: () => void;
};

const useModalNavigationStore = create<ModalNavigationState>((set) => ({
  backgroundPath: null,
  history: [],

  start: (backgroundPath) =>
    set({
      backgroundPath,
      history: [backgroundPath],
    }),

  push: (path) =>
    set((state) => ({
      history: [...state.history, path],
    })),

  reset: () =>
    set({
      backgroundPath: null,
      history: [],
    }),
}));

export default useModalNavigationStore;

import { Component } from '@gated/shared';
import { create } from 'zustand';

const useMapBuilderStore = create<{
  tab: string;
  setTab: (tab: string) => void;
  manifest: object;
  loadManifest: () => Promise<void>;
  path: string[];
  setPath: (path: string[]) => void;
  pushPath: (path: string) => void;
  popPath: () => void;
  activeLayerId: number | null;
  setActiveLayerId: (id: number | null) => void;
  activeComponentId: number | null;
  setActiveComponentId: (id: number | null) => void;
  previewLayerId: number | null;
  setPreviewLayerId: (id: number | null) => void;
  tempComponent: Component | null;
  setTempComponent: (component: Component | null) => void;
}>((set) => ({
  tab: 'tiles',
  setTab: (tab) => set(() => ({ tab })),
  manifest: {},
  loadManifest: async () => {
    const fullPath = '/assets/tiles';

    const response = await fetch(`${fullPath}.json`);
    const data = await response.json();

    set({
      manifest: data,
    });
  },
  path: [],
  setPath: (path) => set(() => ({ path })),
  pushPath: (folder) =>
    set((state) => ({
      path: [...state.path, folder],
    })),
  popPath: () =>
    set((state) => ({
      path: state.path.slice(0, -1),
    })),
  activeLayerId: null,
  setActiveLayerId: (id) => set(() => ({ activeLayerId: id })),
  activeComponentId: null,
  setActiveComponentId: (id) => set(() => ({ activeComponentId: id })),
  previewLayerId: null,
  setPreviewLayerId: (id) => set(() => ({ previewLayerId: id })),
  tempComponent: null,
  setTempComponent: (component) => set(() => ({ tempComponent: component })),
}));

export default useMapBuilderStore;

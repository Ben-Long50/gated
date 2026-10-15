import { create } from 'zustand';

const useMapStore = create<{
  characterId: number | null;
  setCharacterId: (state: number | null) => void;
}>((set) => ({
  characterId: null,
  setCharacterId: (state) => set({ characterId: state }),
}));

export default useMapStore;

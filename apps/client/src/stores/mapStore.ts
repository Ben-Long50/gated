import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import { create } from 'zustand';

const useMapStore = create<{
  action: Action | null;
  range: number;
  rangeColor: string;
  item: Item | null;
  characterId: number | null;
  setAction: (state: Action | null) => void;
  setRange: (value: number, color: string) => void;
  setItem: (state: Item | null) => void;
  setCharacterId: (state: number | null) => void;
}>((set) => ({
  action: null,
  range: 0,
  rangeColor: '',
  item: null,
  characterId: null,
  setAction: (state) => set({ action: state }),
  setRange: (value, color) => set({ range: value, rangeColor: color }),
  setItem: (state) => set({ item: state }),
  setCharacterId: (state) => set({ characterId: state }),
}));

export default useMapStore;

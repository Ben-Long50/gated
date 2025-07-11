import { Item } from 'src/types/item';
import { create } from 'zustand';

type rangeTypes = '' | 'movement' | 'attack';

const useMapStore = create<{
  rangeType: rangeTypes;
  range: number;
  rangeColor: string;
  item: Item | null;
  setRangeType: (state: rangeTypes) => void;
  setRange: (value: number, color: string) => void;
  setItem: (state: Item | null) => void;
}>((set) => ({
  rangeType: '',
  range: 0,
  rangeColor: '',
  item: null,
  setRangeType: (state) => set({ rangeType: state }),
  setRange: (value, color) => set({ range: value, rangeColor: color }),
  setItem: (state) => set({ item: state }),
}));

export default useMapStore;

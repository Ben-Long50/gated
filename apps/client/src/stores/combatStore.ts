import { Item } from 'src/types/item';
import { create } from 'zustand';

const useCombatStore = create<{
  damage: number | null;
  rangeData: { range: number; color: string } | null;
  item: Item | null;
  setDamage: (state: number | null) => void;
  setRangeData: (state: { range: number; color: string } | null) => void;
  setItem: (item: Item | null) => void;
}>((set) => ({
  damage: null,
  rangeData: null,
  item: null,
  setDamage: (state) => set({ damage: state }),
  setRangeData: (state) => set({ rangeData: state }),
  setItem: (item) => set({ item: item }),
}));

export default useCombatStore;

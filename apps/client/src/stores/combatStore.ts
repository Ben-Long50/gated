import { Item } from 'src/types/item';
import { create } from 'zustand';

const useCombatStore = create<{
  damage: number | null;
  range: number | null;
  rangeColor: string | null;
  item: Item | null;
  combatPhase: string | null;
  setDamage: (state: number | null) => void;
  setRange: (value: number | null, color: string | null) => void;
  setItem: (item: Item | null) => void;
  updateItem: (item: Item) => void;
  setCombatPhase: (phase: string | null) => void;
}>((set) => ({
  damage: null,
  range: 0,
  rangeColor: '',
  item: null,
  combatPhase: null,
  setDamage: (state) => set({ damage: state }),
  setRange: (value, color) => set({ range: value, rangeColor: color }),
  setItem: (item) => set({ item: item }),
  updateItem: (item: Item) =>
    set((state) => {
      if (state.item && state.item.id === item.id) {
        return { item: item };
      }
      return {};
    }),
  setCombatPhase: (phase) => set({ combatPhase: phase }),
}));

export default useCombatStore;

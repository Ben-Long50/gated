import { Item } from 'src/types/item';
import { create } from 'zustand';

const useCombatStore = create<{
  target: number | null;
  damage: number | null;
  range: number | null;
  rangeColor: string | null;
  item: Item | null;
  combatPhase: string | null;
  setTarget: (state: number | null) => void;
  setDamage: (state: number | null) => void;
  setRange: (value: number | null, color: string | null) => void;
  setItem: (item: Item | null) => void;
  setCombatPhase: (phase: string | null) => void;
}>((set) => ({
  target: null,
  damage: null,
  range: 0,
  rangeColor: '',
  item: null,
  combatPhase: null,
  setTarget: (state) => set({ target: state }),
  setDamage: (state) => set({ damage: state }),
  setRange: (value, color) => set({ range: value, rangeColor: color }),
  setItem: (item) => set({ item: item }),
  setCombatPhase: (phase) => set({ combatPhase: phase }),
}));

export default useCombatStore;

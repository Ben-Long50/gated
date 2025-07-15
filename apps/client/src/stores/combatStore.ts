import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import { create } from 'zustand';

const useCombatStore = create<{
  userCharacter: number | null;
  activeCharacter: number | null;
  turnOrder: number[];
  action: Action | null;
  range: number | null;
  rangeColor: string | null;
  item: { item: Item | null; selected: boolean };
  setUserCharacter: (state: number | null) => void;
  setActiveCharacter: (state: number | null) => void;
  setTurnOrder: (state: number[]) => void;
  setAction: (state: Action | null) => void;
  setRange: (value: number | null, color: string | null) => void;
  setItem: (item: Item | null, selected: boolean) => void;
}>((set) => ({
  userCharacter: null,
  activeCharacter: null,
  turnOrder: [],
  action: null,
  range: 0,
  rangeColor: '',
  item: { item: null, selected: false },
  setUserCharacter: (state) => set({ userCharacter: state }),
  setActiveCharacter: (state) => set({ activeCharacter: state }),
  setTurnOrder: (state) => set({ turnOrder: state }),
  setAction: (state) => set({ action: state }),
  setRange: (value, color) => set({ range: value, rangeColor: color }),
  setItem: (item, selected) => set({ item: { item, selected } }),
}));

export default useCombatStore;

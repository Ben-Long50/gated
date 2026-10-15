import { create } from 'zustand';

const useNavigationStore = create<{
  navbar: boolean;
  sidebar: boolean;
  navbarHeight: number;
  encounterLayout: boolean;
  setNavbar: (state: boolean) => void;
  setSidebar: (state: boolean) => void;
  setNavbarHeight: (height: number) => void;
  setEncounterLayout: (state: boolean) => void;
  closeBars: () => void;
}>((set) => ({
  navbar: false,
  sidebar: false,
  navbarHeight: 0,
  encounterLayout: false,
  setNavbar: (state) => set({ navbar: state }),
  setSidebar: (state) => set({ sidebar: state }),
  setNavbarHeight: (height) => set({ navbarHeight: height }),
  setEncounterLayout: (state) => set({ encounterLayout: state }),
  closeBars: () => set({ navbar: false, sidebar: false }),
}));

export default useNavigationStore;

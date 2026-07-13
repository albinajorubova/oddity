import { create } from "zustand";

interface UiStoreActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setRegisteredGsap: (value: boolean) => void;
}

interface UiState {
  isOpenMenu: boolean;
  isRegisteredGsap: boolean;
  actions: UiStoreActions;
}

export const useUiStore = create<UiState>((set, _get) => ({
  isRegisteredGsap: false,
  isOpenMenu: false,
  actions: {
    openMenu: () => set({ isOpenMenu: true }),
    closeMenu: () => set({ isOpenMenu: false }),
    toggleMenu: () => set((state) => ({ isOpenMenu: !state.isOpenMenu })),
    setRegisteredGsap: (value: boolean) => set({ isRegisteredGsap: value }),
  },
}));

export const useUiActions = (): UiStoreActions =>
  useUiStore((store) => store.actions);

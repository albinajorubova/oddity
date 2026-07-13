export type AutoSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

type AutoSaveState = {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  saveError: string | null;
};

const initialState: AutoSaveState = {
  status: "idle",
  lastSavedAt: null,
  saveError: null,
};

let state: AutoSaveState = { ...initialState };
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const setAutoSaveState = (updates: Partial<AutoSaveState>) => {
  state = { ...state, ...updates };
  notify();
};

export const getAutoSaveState = () => state;

export const subscribeAutoSaveState = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

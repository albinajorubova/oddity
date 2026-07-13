import {
  type CursorType,
  type MouseCallback,
  MouseData,
} from "@widgets/сursor/types";
import { create } from "zustand";

interface CursorState {
  hoverText: string | null;
  cursorType: CursorType;
  callbacks: MouseCallback[];
  actions: {
    addCallback: (callback: MouseCallback) => void;
    removeCallback: (callback: MouseCallback) => void;
    setHoverText: (text: string | null) => void;
    setCursorType: (type: CursorType) => void;
  };
}

export const useCursorStore = create<CursorState>((set) => ({
  hoverText: null,
  cursorType: "default",
  callbacks: [],
  actions: {
    addCallback: (func) =>
      set((state) => ({
        callbacks: state.callbacks.includes(func)
          ? state.callbacks
          : [...state.callbacks, func],
      })),
    removeCallback: (func) =>
      set((state) => {
        if (!state.callbacks.includes(func)) return state;
        return { callbacks: state.callbacks.filter((cb) => cb !== func) };
      }),
    setCursorType: (type: CursorType) => set({ cursorType: type }),
    setHoverText: (text: string | null) => set({ hoverText: text }),
  },
}));

export const useCursorActions = (): CursorState["actions"] =>
  useCursorStore((state) => state.actions);

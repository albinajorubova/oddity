import { create } from "zustand";

import type { Breakpoints, ViewportStoreType } from "./type";
import { calculateDeviceBreakpoints, getInitialBreakpoints } from "./utils";

const initialBreakpoints = getInitialBreakpoints();
const initialDeviceTypes = calculateDeviceBreakpoints(initialBreakpoints);

export const useViewportStore = create<ViewportStoreType>((set) => ({
  ...initialBreakpoints,
  ...initialDeviceTypes,
  isTouchDevice: false,
  actions: {
    updateBreakpoints: (breakpoints: Breakpoints) =>
      set((state) => ({
        ...state,
        ...breakpoints,
        ...calculateDeviceBreakpoints(breakpoints),
      })),
    updateTouchDevice: (isTouchDevice: boolean) => set({ isTouchDevice }),
  },
}));

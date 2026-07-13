import type { BreakpointKeys } from "@shared/types";

export type Breakpoints = Record<BreakpointKeys, boolean>;

export type ViewportActionsType = {
  updateBreakpoints: (breakpoints: Breakpoints) => void;
  updateTouchDevice: (isTouchDevice: boolean) => void;
};

export type ViewportStoreType = Breakpoints & {
  currentBreakpoint: BreakpointKeys;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  actions: ViewportActionsType;
};

import type { BreakpointKeys } from "@shared/types";

import { useViewportStore } from "./store";

export const useIsMobile = () => useViewportStore((state) => state.isMobile);

export const useIsTablet = () => useViewportStore((state) => state.isTablet);

export const useIsDesktop = () => useViewportStore((state) => state.isDesktop);

const useCurrentBreakpoint = () =>
  useViewportStore((state) => state.currentBreakpoint);

export { useCurrentBreakpoint };

export const useIsBreakpoint = (findBreakpoint: BreakpointKeys) =>
  useCurrentBreakpoint() === findBreakpoint;

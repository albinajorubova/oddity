import type { BreakpointKeys } from "@shared/types";
import { BREAKPOINTS } from "@/shared/config";

import type { Breakpoints } from "./type";

// Сортируем breakpoints по значениям от меньшего к большему
// (вычисляется один раз при загрузке модуля)
// При использовании max-width, находим самый маленький активный breakpoint
// (от меньшего к большему), так как все большие breakpoints тоже будут true

const breakpointOrder: BreakpointKeys[] = Object.entries(BREAKPOINTS)
  .sort(([, a], [, b]) => a - b)
  .map(([key]) => key as BreakpointKeys);

const maxBreakpoint: BreakpointKeys =
  breakpointOrder[breakpointOrder.length - 1];

export const getInitialBreakpoints = (): Breakpoints => {
  return Object.fromEntries(
    Object.entries(BREAKPOINTS).map(([key]) => [key as BreakpointKeys, false]),
  ) as Breakpoints;
};

export const calculateCurrentBreakpoint = (
  breakpoints: Breakpoints,
): BreakpointKeys => {
  return breakpointOrder.find((key) => breakpoints[key]) ?? maxBreakpoint;
};

export const calculateDeviceBreakpoints = (breakpoints: Breakpoints) => {
  const isMobile = breakpoints.xs || breakpoints.sm;
  const isTablet = (breakpoints.md || breakpoints.lg) && !isMobile;
  const isDesktop = !isTablet && !isMobile;
  const currentBreakpoint = calculateCurrentBreakpoint(breakpoints);
  return { isMobile, isTablet, isDesktop, currentBreakpoint };
};

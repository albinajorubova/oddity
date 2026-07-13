import { useEffect } from "react";

import type { BreakpointKeys } from "@shared/types";
import { BREAKPOINTS } from "@/shared/config";

import { useViewportStore } from "./store";

export const useAppViewport = () => {
  useEffect(() => {
    const updateViewport = () => {
      const { actions } = useViewportStore.getState();

      const breakpointsMatches = Object.entries(BREAKPOINTS).reduce(
        (acc, [key, value]) => {
          acc[key as BreakpointKeys] = window.matchMedia(
            `(max-width: ${value}px)`,
          ).matches;
          return acc;
        },
        {} as Record<BreakpointKeys, boolean>,
      );

      const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          ((navigator as Navigator & { msMaxTouchPoints?: number })
            .msMaxTouchPoints ?? 0) > 0);

      actions.updateBreakpoints(breakpointsMatches);
      actions.updateTouchDevice(isTouchDevice);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);
};

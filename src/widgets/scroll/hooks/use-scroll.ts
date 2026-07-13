import React from "react";
import type Lenis from "lenis";

import { useCurrentScroll } from "../context";
import type { ScrollEvent } from "../types";

export const useScroll = (
  callback: ((event: ScrollEvent) => void) | null = null,
  deps: React.DependencyList = [],
  priority: number = 0,
): Lenis | null => {
  const { scroll, addCallback, removeCallback } = useCurrentScroll();

  React.useEffect(() => {
    if (!callback || !addCallback || !removeCallback || !scroll) return;

    addCallback(callback, priority);
    callback(scroll);

    return () => {
      removeCallback(callback);
    };
  }, [scroll, addCallback, removeCallback, priority, ...deps]); // eslint-disable-line

  return scroll;
};

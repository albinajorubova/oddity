import { useCallback, useEffect, useMemo, useRef } from "react";
import type Lenis from "lenis";

import type { ScrollCallback, ScrollEvent } from "../types";

export const useSubscribeScroll = (scroll: Lenis) => {
  const callbacksRefs = useRef<ScrollCallback[]>([]);

  const addCallback = useCallback(
    (callback: (event: ScrollEvent) => void, priority: number) => {
      callbacksRefs.current.push({ callback, priority });
      callbacksRefs.current.sort((a, b) => a.priority - b.priority);
    },
    [],
  );

  const removeCallback = useCallback(
    (callback: (event: ScrollEvent) => void) => {
      callbacksRefs.current = callbacksRefs.current.filter(
        (cb) => cb.callback !== callback,
      );
    },
    [],
  );

  const onScroll = useCallback((e: ScrollEvent) => {
    for (let i = 0; i < callbacksRefs.current.length; i += 1) {
      callbacksRefs.current[i].callback(e);
    }
  }, []);

  useEffect(() => {
    scroll?.on("scroll", onScroll);

    return () => {
      scroll?.off("scroll", onScroll);
    };
  }, [scroll, onScroll]);

  const value = useMemo(() => {
    return {
      scroll,
      addCallback,
      removeCallback,
    };
  }, [scroll, addCallback, removeCallback]);

  return value;
};

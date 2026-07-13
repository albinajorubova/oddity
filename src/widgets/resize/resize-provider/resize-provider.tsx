import { useCallback, useEffect, useRef } from "react";

import { throttleRAF } from "@shared/utils/throttleRAF";

import { ResizeContext } from "../context";
import type { ResizeCallback, ResizeCallbacks } from "../type";

export type ResizeProviderProps = {
  children: React.ReactNode;
};

export const ResizeProvider = ({ children }: ResizeProviderProps) => {
  const callbacksRefs = useRef<ResizeCallbacks>([]);

  const addCallback = useCallback(
    (callback: ResizeCallback, priority: number) => {
      callbacksRefs.current.push({ callback, priority });
      callbacksRefs.current.sort((a, b) => a.priority - b.priority);
    },
    [],
  );

  const removeCallback = useCallback((callback: ResizeCallback) => {
    callbacksRefs.current = callbacksRefs.current.filter(
      (cb) => cb.callback !== callback,
    );
  }, []);

  const onResize = useCallback(() => {
    for (let i = 0; i < callbacksRefs.current.length; i += 1) {
      callbacksRefs.current[i].callback();
    }
  }, []);

  useEffect(() => {
    const scrollRootElement = window.__GLOBAL_SCROLL__?.rootElement;
    const onThrottleResize = throttleRAF(onResize, 30);

    onResize();
    window.addEventListener("resize", onThrottleResize);
    scrollRootElement?.addEventListener("resize-scroll", onResize);

    return () => {
      onThrottleResize.cancel();
      window.removeEventListener("resize", onThrottleResize);
      scrollRootElement?.removeEventListener("resize-scroll", onResize);
    };
  }, []);

  return (
    <ResizeContext.Provider value={{ addCallback, removeCallback }}>
      {children}
    </ResizeContext.Provider>
  );
};

ResizeProvider.displayName = "ResizeProvider";

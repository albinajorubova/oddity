import { useEffect } from "react";

import { useCurrentResize } from "../context";

export type ResizeEvent = () => void;

export const useResize = (
  callback: ResizeEvent,
  deps: React.DependencyList = [],
  priority: number = 0,
) => {
  const { addCallback, removeCallback } = useCurrentResize();

  useEffect(() => {
    if (!callback || !addCallback || !removeCallback) return;

    callback();
    addCallback(callback, priority);

    return () => {
      removeCallback(callback);
    };
  }, [addCallback, removeCallback, priority, ...deps]); // eslint-disable-line
};

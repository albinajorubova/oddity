import { useCallback, useEffect, useRef, useState } from "react";

type ResizeObserverBoxOptions =
  | "border-box"
  | "content-box"
  | "device-pixel-content-box";

interface UseResizeObserverOptions {
  lazy?: boolean;
  debounce?: number;
  box?: ResizeObserverBoxOptions;
  callback?: (entry: ResizeObserverEntry) => void;
}

type UseResizeObserverReturn<T extends boolean> = [
  (element: Element | null) => void,
  T extends true
    ? () => ResizeObserverEntry | undefined
    : ResizeObserverEntry | undefined,
];

export function useResizeObserver<T extends boolean = false>(
  {
    lazy = false as T,
    debounce: debounceDelay = 30,
    box = "border-box",
    callback,
  }: UseResizeObserverOptions & { lazy?: T },
  deps: unknown[] = [],
): UseResizeObserverReturn<T> {
  const entryRef = useRef<ResizeObserverEntry | null>(null);
  const [entry, setEntry] = useState<ResizeObserverEntry>();
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const onResize: ResizeObserverCallback = ([entry]) => {
      entryRef.current = entry;

      if (callback) callback(entry);

      if (!lazy) {
        setEntry(entry);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(element, { box });

    return () => {
      resizeObserver.disconnect();
    };
  }, [element, lazy, debounceDelay, box, ...deps]);

  const get = useCallback(() => entryRef.current, []);

  return [setElement, lazy ? get : entry] as UseResizeObserverReturn<T>;
}

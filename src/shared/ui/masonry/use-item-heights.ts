import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { MasonryItem } from "./types";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type UseItemHeightsOptions<T extends { id: string }> = {
  items: readonly T[];
  estimateHeight: (item: T) => number;
  threshold?: number;
};

export type UseItemHeightsResult<T extends { id: string }> = {
  measuredItems: Array<T & MasonryItem>;
  registerItem: (id: string, node: HTMLElement | null) => void;
  notifyResize: (id: string) => void;
};

export const useItemHeights = <T extends { id: string }>(
  options: UseItemHeightsOptions<T>,
): UseItemHeightsResult<T> => {
  const { items, estimateHeight, threshold = 1 } = options;

  const nodesRef = useRef(new Map<string, HTMLElement>());
  const observerRef = useRef<ResizeObserver | null>(null);
  const estimateRef = useRef(estimateHeight);
  estimateRef.current = estimateHeight;

  const [heights, setHeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const item of items) {
      initial[item.id] = estimateHeight(item);
    }
    return initial;
  });

  const commitHeight = useCallback(
    (id: string, next: number) => {
      if (!Number.isFinite(next) || next <= 0) return;

      setHeights((prev) => {
        const prevValue = prev[id];
        if (prevValue !== undefined && Math.abs(prevValue - next) < threshold) {
          return prev;
        }

        return { ...prev, [id]: next };
      });
    },
    [threshold],
  );

  const measure = useCallback(
    (id: string) => {
      const node = nodesRef.current.get(id);
      if (!node) return;
      commitHeight(id, node.getBoundingClientRect().height);
    },
    [commitHeight],
  );

  useIsomorphicLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const id = target.dataset.masonryId;
        if (!id) continue;

        const height =
          entry.borderBoxSize?.[0]?.blockSize ??
          entry.contentRect.height ??
          target.getBoundingClientRect().height;

        commitHeight(id, height);
      }
    });

    observerRef.current = observer;

    for (const [, node] of nodesRef.current) {
      observer.observe(node);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [commitHeight]);

  useIsomorphicLayoutEffect(() => {
    setHeights((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const item of items) {
        if (next[item.id] === undefined) {
          next[item.id] = estimateRef.current(item);
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [items]);

  const registerItem = useCallback(
    (id: string, node: HTMLElement | null) => {
      const observer = observerRef.current;
      const prev = nodesRef.current.get(id);

      if (prev && prev !== node) {
        observer?.unobserve(prev);
        nodesRef.current.delete(id);
      }

      if (!node) {
        nodesRef.current.delete(id);
        return;
      }

      node.dataset.masonryId = id;
      nodesRef.current.set(id, node);
      observer?.observe(node);
      commitHeight(id, node.getBoundingClientRect().height);
    },
    [commitHeight],
  );

  const notifyResize = useCallback(
    (id: string) => {
      requestAnimationFrame(() => measure(id));
    },
    [measure],
  );

  const measuredItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        height: heights[item.id] ?? estimateHeight(item),
      })),
    [items, heights, estimateHeight],
  );

  return { measuredItems, registerItem, notifyResize };
};

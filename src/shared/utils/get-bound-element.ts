import type { RefObject } from "react";

const defaultBound = { x: 0, y: 0, width: 0, height: 0, right: 0, bottom: 0 };

export const getBoundElement = (
  el: HTMLElement | RefObject<HTMLElement | null> | null,
): {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
} => {
  if (!el) return { ...defaultBound };

  const $el = el instanceof HTMLElement ? el : el.current;
  if (!$el) return { ...defaultBound };

  const bound = $el.getBoundingClientRect();

  return {
    x: bound.x,
    y: bound.y,
    width: bound.width,
    height: bound.height,
    right: bound.x + bound.width,
    bottom: bound.y + bound.height,
  };
};

import type { AnchorScroll } from "@widgets/scroll/types";

import { getBoundElement } from "@shared/utils/get-bound-element";

export const getScrollPosition = (el: HTMLElement): number => {
  const computedStyle = getComputedStyle(el);

  const elPosition = computedStyle.position;
  const isSticky = elPosition === "sticky";
  let originalPosition: string | null = null;
  let originalTop: string | null = null;

  const scrollStyle = (el.dataset.anchorScroll as AnchorScroll) || "center";

  if (isSticky) {
    originalPosition = computedStyle.position;
    originalTop = computedStyle.top;
    el.style.position = "relative";
    el.style.top = "auto";
  }

  const bound = getBoundElement(el);
  const margin = Math.min(
    parseInt(computedStyle.getPropertyValue("margin-top"), 10),
    0,
  );

  const anchorTop =
    parseInt(el.style.getPropertyValue("--anchor-top") || "0", 10) * -1;

  const offset =
    scrollStyle === "top"
      ? isSticky
        ? Math.min(parseInt(originalTop || "0", 10) * -1, 0)
        : 0
      : Math.max(window.innerHeight - bound.height, 0) * -0.5;

  const initialPosition =
    bound.y + window.__GLOBAL_SCROLL__.scroll + margin * -1;
  const scrollPosition = initialPosition + (anchorTop || offset);

  if (isSticky) {
    if (originalPosition) {
      el.style.position = originalPosition;
    }
    if (originalTop) {
      el.style.top = originalTop;
    }
  }

  return scrollPosition;
};

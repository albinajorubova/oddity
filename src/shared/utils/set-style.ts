import type { RefObject } from "react";

export const setStyle = (
  el: HTMLElement | RefObject<HTMLElement | null> | null,
  name: string,
  value: string,
) => {
  if (el) {
    const $el = el instanceof HTMLElement ? el : el.current;
    $el?.style?.setProperty(name, value);
  }
};

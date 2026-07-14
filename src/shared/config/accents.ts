import type { MouseEvent } from "react";

/**
 * Lime family accents — stay close to acid green.
 * acid lime → chartreuse → warm yellow → soft orange
 */
export const TOXIC_ACCENTS = [
  "#bfff00", // acid lime
  "#d4ff00", // chartreuse
  "#ffe600", // warm yellow
  "#ffb347", // soft orange
] as const;

export type ToxicAccent = (typeof TOXIC_ACCENTS)[number];

export const getRandomAccent = (): ToxicAccent => {
  const index = Math.floor(Math.random() * TOXIC_ACCENTS.length);
  return TOXIC_ACCENTS[index] ?? TOXIC_ACCENTS[0];
};

/** Sets `--hover-blotch` on the hovered element for CSS blotch/button fills. */
export const setRandomHoverBlotch = (event: MouseEvent<HTMLElement>): void => {
  event.currentTarget.style.setProperty("--hover-blotch", getRandomAccent());
};

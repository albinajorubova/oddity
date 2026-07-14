import type { PerLetter } from "./target";

/** Odd / even alternating values. */
export const alternate =
  (even: number, odd: number): PerLetter<number> =>
  (index) =>
    index % 2 === 0 ? even : odd;

/** Fan from center: … -2 -1 0 1 2 … */
export const fan =
  (step: number): PerLetter<number> =>
  (index, count) =>
    (index - (count - 1) / 2) * step;

/** Repeating signed pattern × amplitude (up / down scatter). */
export const scatter =
  (
    amplitude: number,
    pattern: readonly number[] = [-1, 1, -0.65, 1.15, -1.05, 0.75],
  ): PerLetter<number> =>
  (index) =>
    (pattern[index % pattern.length] ?? 1) * amplitude;

/** Mild stepped intensity by index. */
export const stepped =
  (base: number, step: number, mod = 3): PerLetter<number> =>
  (index) =>
    base + (index % mod) * step;

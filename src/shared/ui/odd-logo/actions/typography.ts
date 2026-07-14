import { clamp } from "../utils";
import type { PerLetter, Target } from "./target";
import { apply, resolveAmount } from "./target";

export const changeWeight = (index: number, weight: number) =>
  apply(index, {
    fontWeight: clamp(weight, 300, 900),
  });

export const stretchLetter = (index: number, amount = 1.12) =>
  apply(index, {
    scaleX: clamp(amount, 1, 1.2),
    scaleY: clamp(2 - amount, 0.85, 1),
  });

export const squashLetter = (index: number, amount = 0.88) =>
  apply(index, {
    scaleX: clamp(amount, 0.8, 1),
    scaleY: clamp(2 - amount, 1, 1.18),
  });

export const stretch = (
  amount: PerLetter<number> = 1.12,
  target: Target = "all",
) =>
  apply(target, (i, n) => {
    const value = resolveAmount(amount, i, n);
    return {
      scaleX: clamp(value, 1, 1.2),
      scaleY: clamp(2 - value, 0.85, 1),
    };
  });

export const squash = (
  amount: PerLetter<number> = 0.88,
  target: Target = "all",
) =>
  apply(target, (i, n) => {
    const value = resolveAmount(amount, i, n);
    return {
      scaleX: clamp(value, 0.8, 1),
      scaleY: clamp(2 - value, 1, 1.18),
    };
  });

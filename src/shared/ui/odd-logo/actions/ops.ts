import type { LogoAction, LogoState } from "../types";
import { clamp } from "../utils";
import {
  changeGap as setGap,
  setLetterSlots,
  visualSwap,
  visualSwapNeighbors,
} from "./layout";
import { apply, type PerLetter, resolveAmount, type Target } from "./target";

export const moveLetter =
  (
    x: PerLetter<number>,
    y: PerLetter<number> = 0,
    target: Target = "all",
  ): LogoAction =>
  (state: LogoState) => {
    const afterX = apply(target, (i, n) => ({
      x: clamp(resolveAmount(x, i, n), -20, 20),
    }))(state);
    return apply(target, (i, n) => ({
      y: clamp(resolveAmount(y, i, n), -28, 28),
    }))(afterX);
  };

export const shiftX = (
  amount: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    x: clamp(resolveAmount(amount, i, n), -20, 20),
  }));

export const shiftY = (
  amount: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    y: clamp(resolveAmount(amount, i, n), -28, 28),
  }));

export const raiseLetter = (
  amount: PerLetter<number> = 4,
  target: Target = "all",
): LogoAction =>
  shiftY((i, n) => -Math.abs(resolveAmount(amount, i, n)), target);

export const dropLetter = (
  amount: PerLetter<number> = 4,
  target: Target = "all",
): LogoAction =>
  shiftY((i, n) => Math.abs(resolveAmount(amount, i, n)), target);

export const rotateLetter = (
  degrees: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    rotate: clamp(resolveAmount(degrees, i, n), -14, 14),
  }));

export const scaleLetter = (
  scale: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    scale: clamp(resolveAmount(scale, i, n), 0.85, 1.15),
  }));

export const skewLetter = (
  skewX: PerLetter<number>,
  target: Target = "all",
  skewY: PerLetter<number> = 0,
): LogoAction =>
  apply(target, (i, n) => ({
    skewX: clamp(resolveAmount(skewX, i, n), -12, 12),
    skewY: clamp(resolveAmount(skewY, i, n), -8, 8),
  }));

export const tiltLetter = (
  degrees: PerLetter<number> = 5,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => {
    const deg = resolveAmount(degrees, i, n);
    return {
      rotate: clamp(deg, -14, 14),
      skewX: clamp(deg * 0.35, -6, 6),
    };
  });

export const changeColor = (
  color: string,
  target: Target = "all",
): LogoAction => apply(target, { color });

export const changeWeight = (
  weight: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    fontWeight: clamp(resolveAmount(weight, i, n), 300, 900),
  }));

export const changeOpacity = (
  opacity: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    opacity: clamp(resolveAmount(opacity, i, n), 0, 1),
  }));

export const changeGap = (gap: number): LogoAction => setGap(gap);

export const spreadGap = (amount = 0.15): LogoAction => setGap(amount);

export const compressGap = (amount = 0.08): LogoAction =>
  setGap(-Math.abs(amount));

export const shuffleLetters = (slots: readonly number[]): LogoAction =>
  setLetterSlots(slots);

export const swapLetters = (a: number, b: number): LogoAction =>
  visualSwap(a, b);

export const swapNeighbors = (
  index: number,
  direction: 1 | -1 = 1,
): LogoAction => visualSwapNeighbors(index, direction);

export const replaceGlyph = (
  glyph: string,
  target: Target = "all",
): LogoAction => apply(target, { glyph });

export const flipLetter = (target: Target = "all"): LogoAction =>
  apply(target, { scaleX: -1 });

export const hideLetter = (target: Target = "all"): LogoAction =>
  changeOpacity(0, target);

export const showLetter = (target: Target = "all"): LogoAction =>
  changeOpacity(1, target);

export const stretchLetter = (
  amount: PerLetter<number> = 1.12,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => {
    const value = resolveAmount(amount, i, n);
    return {
      scaleX: clamp(value, 1, 1.2),
      scaleY: clamp(2 - value, 0.85, 1),
    };
  });

export const squashLetter = (
  amount: PerLetter<number> = 0.88,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => {
    const value = resolveAmount(amount, i, n);
    return {
      scaleX: clamp(value, 0.8, 1),
      scaleY: clamp(2 - value, 1, 1.18),
    };
  });

export const glowLetter = (
  amount: PerLetter<number> = 8,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    glow: clamp(resolveAmount(amount, i, n), 0, 16),
  }));

export const blurLetter = (
  amount: PerLetter<number> = 1.5,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    blur: clamp(resolveAmount(amount, i, n), 0, 3),
  }));

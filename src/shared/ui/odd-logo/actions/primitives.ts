import type { LogoAction } from "../types";
import { clamp } from "../utils";
import { alternate } from "./patterns";
import { apply, type PerLetter, resolveAmount, type Target } from "./target";

/**
 * Value first, target last (default `"all"`).
 *
 *   shiftY(scatter(8))     // whole word
 *   raise(3, 2)            // letter index 2
 *   tint(lime, accent)
 *
 * y: negative = up, positive = down
 */

export const shiftY = (
  amount: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    y: clamp(resolveAmount(amount, i, n), -28, 28),
  }));

export const shiftX = (
  amount: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    x: clamp(resolveAmount(amount, i, n), -20, 20),
  }));

/** Lift up. `amount` = positive strength. */
export const raise = (
  amount: PerLetter<number> = 4,
  target: Target = "all",
): LogoAction =>
  shiftY((i, n) => -Math.abs(resolveAmount(amount, i, n)), target);

/** Push down. `amount` = positive strength. */
export const drop = (
  amount: PerLetter<number> = 4,
  target: Target = "all",
): LogoAction =>
  shiftY((i, n) => Math.abs(resolveAmount(amount, i, n)), target);

export const rotateBy = (
  degrees: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    rotate: clamp(resolveAmount(degrees, i, n), -14, 14),
  }));

export const skewBy = (
  skewX: PerLetter<number>,
  target: Target = "all",
  skewY: PerLetter<number> = 0,
): LogoAction =>
  apply(target, (i, n) => ({
    skewX: clamp(resolveAmount(skewX, i, n), -12, 12),
    skewY: clamp(resolveAmount(skewY, i, n), -8, 8),
  }));

/** Rotate + soft skew. */
export const tilt = (
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

export const scaleBy = (
  scale: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    scale: clamp(resolveAmount(scale, i, n), 0.85, 1.15),
  }));

export const breath = (
  scale: PerLetter<number> = 1.03,
  target: Target = "all",
): LogoAction => scaleBy(scale, target);

export const bounce = (
  lift: PerLetter<number> = 6,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => {
    const up = Math.abs(resolveAmount(lift, i, n));
    return {
      y: clamp(-up, -28, 0),
      scaleX: 1.04,
      scaleY: 0.94,
    };
  });

export const tint = (color: string, target: Target = "all"): LogoAction =>
  apply(target, { color });

export const fadeBy = (
  opacity: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    opacity: clamp(resolveAmount(opacity, i, n), 0.25, 1),
  }));

export const glowBy = (
  amount: PerLetter<number> = 8,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    glow: clamp(resolveAmount(amount, i, n), 0, 16),
  }));

export const blurBy = (
  amount: PerLetter<number> = 1.5,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    blur: clamp(resolveAmount(amount, i, n), 0, 3),
  }));

export const mirror = (target: Target = "all"): LogoAction =>
  apply(target, { scaleX: -1 });

export const weightBy = (
  weight: PerLetter<number>,
  target: Target = "all",
): LogoAction =>
  apply(target, (i, n) => ({
    fontWeight: clamp(resolveAmount(weight, i, n), 300, 900),
  }));

/** Alternate lean left / right. */
export const waveTilt = (degrees = 2.5, target: Target = "all"): LogoAction =>
  tilt(alternate(-degrees, degrees), target);

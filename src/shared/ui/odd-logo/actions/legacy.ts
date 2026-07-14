import type { LogoAction, LogoState } from "../types";
import {
  bounce,
  drop,
  fadeBy,
  glowBy,
  rotateBy,
  scaleBy,
  shiftX,
  shiftY,
  skewBy,
  tilt,
  tint,
} from "./primitives";

/** Letter-first convenience wrappers. */

export const moveLetter =
  (index: number, x: number, y = 0): LogoAction =>
  (state: LogoState) =>
    shiftY(y, index)(shiftX(x, index)(state));

export const rotateLetter = (index: number, degrees: number) =>
  rotateBy(degrees, index);

export const scaleLetter = (index: number, scale: number) =>
  scaleBy(scale, index);

export const skewLetter = (index: number, skewX: number, skewY = 0) =>
  skewBy(skewX, index, skewY);

export const bounceLetter = (index: number, lift = -6) =>
  bounce(Math.abs(lift), index);

export const raiseLetter = (index: number, amount = -4) =>
  shiftY(amount, index);

export const dropLetter = (index: number, amount = 5) => drop(amount, index);

export const tiltLetter = (index: number, degrees = 5) => tilt(degrees, index);

export const colorLetter = (index: number, color: string) => tint(color, index);

export const fadeLetter = (index: number, opacity = 0.45) =>
  fadeBy(opacity, index);

export const glowLetter = (index: number, amount = 8) => glowBy(amount, index);

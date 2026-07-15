import {
  alternate,
  changeColor,
  compressGap,
  dropLetter,
  fan,
  raiseLetter,
  rotateLetter,
  scaleLetter,
  scatter,
  shiftX,
  shiftY,
  shuffleLetters,
  skewLetter,
  spreadGap,
  type Target,
  tiltLetter,
} from "../actions";
import type { LogoAction } from "../types";
import { randomInt } from "../utils";
import { MOTION } from "./config";

export type Step =
  | { type: "randomLetter" }
  | { type: "nextLetter" }
  | { type: "all" }
  | { type: "run"; fn: (target: Target, count: number) => LogoAction };

export type Recipe = (count: number) => LogoAction[];

const shuffledSlots = (count: number): number[] => {
  const slots = Array.from({ length: count }, (_, i) => i);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    const a = slots[i];
    const b = slots[j];
    if (a === undefined || b === undefined) continue;
    slots[i] = b;
    slots[j] = a;
  }

  const isIdentity = slots.every((slot, i) => slot === i);
  if (isIdentity && count > 1) {
    slots[0] = 1;
    slots[1] = 0;
  }

  return slots;
};

export const randomLetter = (): Step => ({ type: "randomLetter" });

export const nextLetter = (): Step => ({ type: "nextLetter" });

export const allLetters = (): Step => ({ type: "all" });

export const color = (value: string = MOTION.accent): Step => ({
  type: "run",
  fn: (target) => changeColor(value, target),
});

export const raise = (amount: number = MOTION.raise.mid): Step => ({
  type: "run",
  fn: (target) => raiseLetter(amount, target),
});

export const drop = (amount: number = MOTION.raise.mid): Step => ({
  type: "run",
  fn: (target) => dropLetter(amount, target),
});

export const scale = (amount: number = MOTION.scale.one): Step => ({
  type: "run",
  fn: (target) => scaleLetter(amount, target),
});

export const rotate = (degrees: number): Step => ({
  type: "run",
  fn: (target) => rotateLetter(degrees, target),
});

export const skew = (amount: number): Step => ({
  type: "run",
  fn: (target) => skewLetter(amount, target),
});

export const moveX = (amount: number): Step => ({
  type: "run",
  fn: (target) => shiftX(amount, target),
});

export const gapSpread = (amount: number = MOTION.gap.spread): Step => ({
  type: "run",
  fn: () => spreadGap(amount),
});

export const gapCompress = (amount: number = MOTION.gap.compress): Step => ({
  type: "run",
  fn: () => compressGap(amount),
});

export const yScatter = (amplitude: number = MOTION.scatterY.mid): Step => ({
  type: "run",
  fn: () => shiftY(scatter(amplitude)),
});

export const fanTilt = (step: number = MOTION.tilt.fan): Step => ({
  type: "run",
  fn: () => tiltLetter(fan(step)),
});

export const waveTilt = (degrees: number = MOTION.tilt.wave): Step => ({
  type: "run",
  fn: () => tiltLetter(alternate(-degrees, degrees)),
});

export const waveSkew = (amount: number = MOTION.skew.compress): Step => ({
  type: "run",
  fn: () => skewLetter((i) => (i % 2 === 0 ? -amount : amount)),
});

export const gravityX = (): Step => ({
  type: "run",
  fn: () =>
    shiftX(
      (i) => (i % 2 === 0 ? -1 : 1) * (MOTION.shiftX.gravityBase + (i % 3)),
    ),
});

export const gravityRotate = (): Step => ({
  type: "run",
  fn: () =>
    rotateLetter(
      (i) =>
        (i % 2 === 0 ? -1 : 1) *
        (MOTION.rotate.gravityBase + (i % 3) * MOTION.rotate.gravityStep),
    ),
});

export const shuffle = (): Step => ({
  type: "run",
  fn: (_target, count) => shuffleLetters(shuffledSlots(count)),
});

export const resolveSteps = (
  steps: readonly Step[],
  count: number,
): LogoAction[] => {
  let target: Target = "all";
  let index = 0;
  const actions: LogoAction[] = [];

  for (const step of steps) {
    switch (step.type) {
      case "randomLetter": {
        index = randomInt(0, Math.max(0, count - 1));
        target = index;
        break;
      }
      case "nextLetter": {
        index = count > 1 ? (index + 1) % count : index;
        target = index;
        break;
      }
      case "all": {
        target = "all";
        break;
      }
      case "run": {
        actions.push(step.fn(target, count));
        break;
      }
    }
  }

  return actions;
};

export const recipe =
  (steps: readonly Step[]): Recipe =>
  (count) =>
    resolveSteps(steps, count);

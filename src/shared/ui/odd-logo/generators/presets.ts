import {
  compress,
  drop,
  fan,
  raise,
  rotateBy,
  scaleBy,
  scatter,
  shiftX,
  shiftY,
  skewBy,
  spread,
  tilt,
  tint,
  visualShuffle,
  visualSwapNeighbors,
  waveTilt,
} from "../actions";
import type { LogoAction } from "../types";
import { randomInt } from "../utils";
import { type BeatId, MOTION } from "./config";

type BeatRecipe = (letterCount: number) => LogoAction[];

const {
  accent,
  scatterY,
  raise: raiseAmt,
  gap,
  tilt: tiltAmt,
  skew,
  shiftX: xAmt,
  rotate,
  scale,
} = MOTION;

const randomLetter = (n: number) => randomInt(0, Math.max(0, n - 1));

const accentTint = (index: number): LogoAction => tint(accent, index);

const spreadBeat: BeatRecipe = (n) => [
  spread(gap.spread),
  tilt(fan(tiltAmt.fan)),
  shiftY(scatter(scatterY.mid)),
  accentTint(randomLetter(n)),
];

const compressed: BeatRecipe = (n) => [
  compress(gap.compress),
  waveTilt(tiltAmt.wave),
  shiftY(scatter(scatterY.mid)),
  skewBy((i) => (i % 2 === 0 ? -skew.compress : skew.compress)),
  accentTint(randomLetter(n)),
];

const highlight: BeatRecipe = (n) => {
  const i = randomLetter(n);
  return [
    accentTint(i),
    scaleBy(scale.highlight, i),
    raise(raiseAmt.strong, i),
    rotateBy(tiltAmt.highlight, i),
  ];
};

const gravity: BeatRecipe = (n) => [
  shiftY(scatter(scatterY.strong)),
  shiftX((i) => (i % 2 === 0 ? -1 : 1) * (xAmt.gravityBase + (i % 3))),
  rotateBy(
    (i) =>
      (i % 2 === 0 ? -1 : 1) *
      (rotate.gravityBase + (i % 3) * rotate.gravityStep),
  ),
  accentTint(randomLetter(n)),
];

const mistake: BeatRecipe = (n) => {
  const i = randomLetter(n);
  const direction: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  return [
    visualSwapNeighbors(i, direction),
    raise(raiseAmt.mid, i),
    accentTint(i),
  ];
};

const shuffleBeat: BeatRecipe = () => [visualShuffle()];

const glitch: BeatRecipe = (n) => {
  const i = randomLetter(n);
  const next = n > 1 ? (i + 1) % n : i;
  const sign = Math.random() < 0.5 ? -1 : 1;
  return [
    skewBy(sign * skew.glitch, i),
    shiftX(sign * xAmt.glitch, i),
    raise(raiseAmt.soft, i),
    accentTint(i),
    drop(raiseAmt.mid, next),
  ];
};

export const BEAT_RECIPES: Record<BeatId, BeatRecipe> = {
  spread: spreadBeat,
  highlight,
  compressed,
  gravity,
  mistake,
  shuffle: shuffleBeat,
  glitch,
};

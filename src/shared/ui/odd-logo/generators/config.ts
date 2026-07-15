import { LOGO_COLORS } from "../types";

export const MOTION = {
  accent: LOGO_COLORS.lime,

  scatterY: {
    mid: 14,
    strong: 22,
  },

  raise: {
    soft: 6,
    mid: 8,
    strong: 10,
  },

  gap: {
    spread: 0.16,
    compress: 0.08,
  },

  tilt: {
    fan: 1.8,
    wave: 2.5,
    highlight: -3,
  },

  skew: {
    compress: 2,
    glitch: 6,
  },

  shiftX: {
    glitch: 3,
    gravityBase: 2,
  },

  rotate: {
    gravityBase: 4,
    gravityStep: 2,
    one: 5,
  },

  scale: {
    highlight: 1.06,
    one: 1.08,
  },
} as const;

export const RECIPE_CONFIG = {
  spread: { weight: 2 },
  highlight: { weight: 1 },
  compressed: { weight: 2 },
  gravity: { weight: 1 },
  mistake: { weight: 3 },
  shuffle: { weight: 1 },
  glitch: { weight: 3 },
} as const;

export type RecipeId = keyof typeof RECIPE_CONFIG;

export const RECIPE_IDS = Object.keys(RECIPE_CONFIG) as RecipeId[];

export const RECIPE_WEIGHTS = Object.fromEntries(
  RECIPE_IDS.map((id) => [id, RECIPE_CONFIG[id].weight]),
) as Record<RecipeId, number>;

export type BeatId = RecipeId;
export const BEAT_CONFIG = RECIPE_CONFIG;
export const BEAT_IDS = RECIPE_IDS;
export const BEAT_WEIGHTS = RECIPE_WEIGHTS;

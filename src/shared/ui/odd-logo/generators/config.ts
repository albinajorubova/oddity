import { LOGO_COLORS } from "../types";

/**
 * Shared motion tokens — reuse identical values across beats.
 * Tune intensity here; presets only compose primitives.
 */
export const MOTION = {
  accent: LOGO_COLORS.lime,

  /** Vertical scatter amplitudes (px-ish via GSAP y). */
  scatterY: {
    mid: 14, // spread, compressed
    strong: 22, // gravity
  },

  /** Single-letter raise (positive = up). */
  raise: {
    soft: 6, // glitch
    mid: 8, // mistake, glitch drop neighbor
    strong: 10, // highlight
  },

  /** Layout gap (em). */
  gap: {
    spread: 0.16,
    compress: 0.08,
  },

  /** Rotation / lean. */
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
  },

  scale: {
    highlight: 1.06,
  },
} as const;

/**
 * Beat registry — names + picker weights in one place.
 */
export const BEAT_CONFIG = {
  spread: { weight: 2 },
  highlight: { weight: 1 },
  compressed: { weight: 2 },
  gravity: { weight: 1 },
  mistake: { weight: 3 },
  shuffle: { weight: 1 },
  glitch: { weight: 3 },
} as const;

export type BeatId = keyof typeof BEAT_CONFIG;

export const BEAT_IDS = Object.keys(BEAT_CONFIG) as BeatId[];

export const BEAT_WEIGHTS = Object.fromEntries(
  BEAT_IDS.map((id) => [id, BEAT_CONFIG[id].weight]),
) as Record<BeatId, number>;

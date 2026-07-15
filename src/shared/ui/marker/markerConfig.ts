import type { MarkerDirection } from "./types";

export const MARKER_COLORS: Record<string, string> = {
  lime: "var(--c-accent-lime)",
  accent: "var(--c-accent)",
  yellow: "var(--c-accent-yellow)",
  orange: "var(--c-accent-orange)",
};

export const MARKER_MOTION = {
  duration: 0.52,
  durationJitter: 0.05,
  exitRatio: 0.55,
  exitMax: 0.28,

  overshoot: { min: 1.02, max: 1.04 },
  inkOpacity: { min: 0.9, max: 1 },
  bleedOpacity: { min: 0.15, max: 0.25 },
  yOffset: { min: -1.5, max: 1.5 },

  tilt: { min: -1.6, max: 1.6 },
  tiltJitter: 0.5,

  pressure: {
    start: { min: 0.9, max: 0.96 },
    mid: { min: 1.04, max: 1.1 },
    end: { min: 0.94, max: 1 },
  },

  variation: {
    rotate: { min: -2.5, max: 2.5 },
    scaleX: { min: 0.97, max: 1.04 },
    scaleY: { min: 0.92, max: 1.08 },
    y: { min: -1.2, max: 1.2 },
  },

  hand: {
    midAt: 0.45,
    settleAt: 0.82,
  },
} as const;

/** CustomEase path: quick start → ease mid → soft push → stop. */
export const MARKER_DRAW_EASE =
  "M0,0 C0.06,0.42 0.14,0.78 0.3,0.84 0.46,0.9 0.56,0.84 0.7,0.9 0.86,0.97 0.94,0.99 1,1";

export const transformOriginFor = (direction: MarkerDirection): string => {
  switch (direction) {
    case "rtl":
      return "right center";
    case "center":
      return "center center";
    default:
      return "left center";
  }
};

export const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const jitter = (value: number, fraction: number) =>
  value * (1 + randomBetween(-fraction, fraction));

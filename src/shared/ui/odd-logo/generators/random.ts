import {
  bounce,
  compress,
  drop,
  raise,
  rotateBy,
  scaleBy,
  shiftX,
  shiftY,
  skewBy,
  spread,
  tint,
  visualSwapNeighbors,
} from "../actions";
import { LOGO_COLORS, type LogoAction } from "../types";
import { pick, randomInt } from "../utils";

const randomIndex = (count: number) => randomInt(0, Math.max(0, count - 1));

export const randomLayout = (letterCount: number): LogoAction => {
  const kinds = ["spread", "compress", "swap"] as const;

  switch (pick(kinds)) {
    case "spread":
      return spread(0.1 + Math.random() * 0.08);
    case "compress":
      return compress(0.04 + Math.random() * 0.05);
    case "swap": {
      const index = randomIndex(letterCount);
      const direction: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      return visualSwapNeighbors(index, direction);
    }
  }
};

export const randomMotion = (letterCount: number): LogoAction => {
  const index = randomIndex(letterCount);
  const kinds = [
    "rotate",
    "scale",
    "skew",
    "move",
    "bounce",
    "raise",
    "drop",
  ] as const;

  switch (pick(kinds)) {
    case "rotate":
      return rotateBy(
        (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 5),
        index,
      );
    case "scale":
      return scaleBy(0.92 + Math.random() * 0.16, index);
    case "skew":
      return skewBy(
        (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 4),
        index,
      );
    case "move":
      return (state) =>
        shiftY(
          (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 8),
          index,
        )(
          shiftX(
            (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 4),
            index,
          )(state),
        );
    case "bounce":
      return bounce(8 + Math.random() * 6, index);
    case "raise":
      return raise(8 + Math.random() * 6, index);
    case "drop":
      return drop(8 + Math.random() * 6, index);
  }
};

export const randomColor = (letterCount: number): LogoAction => {
  const index = randomIndex(letterCount);
  return tint(LOGO_COLORS.lime, index);
};

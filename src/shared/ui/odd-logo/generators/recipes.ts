import { MOTION, type RecipeId } from "./config";
import {
  color,
  drop,
  fanTilt,
  gapCompress,
  gapSpread,
  gravityRotate,
  gravityX,
  moveX,
  nextLetter,
  type Recipe,
  raise,
  randomLetter,
  recipe,
  rotate,
  scale,
  shuffle,
  skew,
  waveSkew,
  waveTilt,
  yScatter,
} from "./steps";

export type { Recipe } from "./steps";

export const RECIPES: Record<RecipeId, Recipe> = {
  spread: recipe([gapSpread(), fanTilt(), yScatter(), randomLetter(), color()]),

  highlight: recipe([
    randomLetter(),
    color(),
    scale(MOTION.scale.highlight),
    raise(MOTION.raise.strong),
    rotate(MOTION.tilt.highlight),
  ]),

  compressed: recipe([
    gapCompress(),
    waveTilt(),
    yScatter(),
    waveSkew(),
    randomLetter(),
    color(),
  ]),

  gravity: recipe([
    yScatter(MOTION.scatterY.strong),
    gravityX(),
    gravityRotate(),
    randomLetter(),
    color(),
  ]),

  mistake: recipe([randomLetter(), raise(), color()]),

  shuffle: recipe([shuffle()]),

  glitch: recipe([
    randomLetter(),
    skew(MOTION.skew.glitch),
    moveX(MOTION.shiftX.glitch),
    raise(MOTION.raise.soft),
    color(),
    nextLetter(),
    drop(),
  ]),
};

export {
  compress,
  setLetterSlots,
  spread,
  visualSwap,
  visualSwapNeighbors,
} from "./layout";
export {
  blurLetter,
  changeColor,
  changeGap,
  changeOpacity,
  changeWeight,
  compressGap,
  dropLetter,
  flipLetter,
  glowLetter,
  hideLetter,
  moveLetter,
  raiseLetter,
  replaceGlyph,
  rotateLetter,
  scaleLetter,
  shiftX,
  shiftY,
  showLetter,
  shuffleLetters,
  skewLetter,
  spreadGap,
  squashLetter,
  stretchLetter,
  swapLetters,
  swapNeighbors,
  tiltLetter,
} from "./ops";
export {
  alternate,
  fan,
  scatter,
  stepped,
} from "./patterns";
export type { PerLetter, Target } from "./target";
export { apply, resolveAmount, resolveTargets } from "./target";

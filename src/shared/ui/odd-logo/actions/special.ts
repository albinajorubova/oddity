import { blurBy, mirror } from "./primitives";

export const mirrorLetter = (index: number) => mirror(index);

export const blurLetter = (index: number, amount = 1.5) =>
  blurBy(amount, index);

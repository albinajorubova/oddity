import type { LogoAction } from "../types";
import { clamp, clampIndex, updateLetter } from "../utils";

/**
 * Layout layer — gap + visual slots.
 * Never reorders DOM. Never touches color / opacity / scale / rotate.
 */

export const changeGap =
  (gap: number): LogoAction =>
  (state) => ({
    ...state,
    gap: clamp(gap, -0.12, 0.28),
  });

export const spread =
  (amount = 0.15): LogoAction =>
  (state) =>
    changeGap(amount)(state);

export const compress =
  (amount = 0.08): LogoAction =>
  (state) =>
    changeGap(-Math.abs(amount))(state);

/**
 * Visual neighbor swap — exchange `slot` only.
 * DOM stays ODDITY; letters slide into each other’s columns via x.
 */
export const visualSwap =
  (a: number, b: number): LogoAction =>
  (state) => {
    const len = state.letters.length;
    if (len < 2) return state;

    const i = clampIndex(a, len);
    const j = clampIndex(b, len);
    if (i === j) return state;

    const left = state.letters[i];
    const right = state.letters[j];
    if (!left || !right) return state;

    return updateLetter(updateLetter(state, i, { slot: right.slot }), j, {
      slot: left.slot,
    });
  };

export const visualSwapNeighbors =
  (index: number, direction: 1 | -1 = 1): LogoAction =>
  (state) => {
    const len = state.letters.length;
    if (len < 2) return state;

    const from = clampIndex(index, len);
    let to = from + direction;
    if (to < 0 || to >= len) to = from - direction;
    to = clamp(to, 0, len - 1);
    if (to === from) return state;

    return visualSwap(from, to)(state);
  };

export const visualShuffle = (): LogoAction => (state) => {
  const count = state.letters.length;
  if (count < 2) return state;

  const slots = state.letters.map((_, i) => i);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = slots[i];
    const b = slots[j];
    if (a === undefined || b === undefined) continue;
    slots[i] = b;
    slots[j] = a;
  }

  // Avoid a no-op identity permutation when possible.
  const isIdentity = slots.every((slot, i) => slot === i);
  if (isIdentity && count > 1) {
    slots[0] = 1;
    slots[1] = 0;
  }

  return {
    ...state,
    letters: state.letters.map((letter, i) => ({
      ...letter,
      slot: slots[i] ?? letter.slot,
    })),
  };
};

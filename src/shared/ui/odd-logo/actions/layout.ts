import type { LogoAction } from "../types";
import { clamp, clampIndex, updateLetter } from "../utils";

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

export const setLetterSlots =
  (slots: readonly number[]): LogoAction =>
  (state) => {
    const count = state.letters.length;
    if (slots.length !== count) return state;

    return {
      ...state,
      letters: state.letters.map((letter, i) => ({
        ...letter,
        slot: slots[i] ?? letter.slot,
      })),
    };
  };

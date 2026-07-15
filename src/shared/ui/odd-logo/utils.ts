import type { LetterState, LogoAction, LogoState } from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const clampIndex = (index: number, length: number) => {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
};

export const updateLetter = (
  state: LogoState,
  index: number,
  patch: Partial<Omit<LetterState, "id" | "char">>,
): LogoState => {
  const i = clampIndex(index, state.letters.length);
  const target = state.letters[i];
  if (!target) return state;

  return {
    ...state,
    letters: state.letters.map((letter, li) =>
      li === i
        ? {
            ...letter,
            ...patch,
            id: letter.id,
            char: letter.char,
          }
        : letter,
    ),
  };
};

export const mapLetters = (
  state: LogoState,
  mapFn: (letter: LetterState, index: number) => LetterState,
): LogoState => ({
  ...state,
  letters: state.letters.map(mapFn),
});

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(items: readonly T[]): T => {
  const item = items[randomInt(0, items.length - 1)];
  if (item === undefined) {
    throw new Error("pick() called with empty array");
  }
  return item;
};

export const maybe =
  (action: LogoAction, probability = 0.5): LogoAction =>
  (state) =>
    Math.random() < probability ? action(state) : state;

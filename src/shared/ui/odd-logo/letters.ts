import { DEFAULT_LETTER, type LetterState, type LogoState } from "./types";

/** Stable identities — create once, DOM order never changes. */
export const tokenize = (word: string): Pick<LetterState, "id" | "char">[] => {
  const counts: Record<string, number> = {};

  return word.split("").map((char) => {
    counts[char] = (counts[char] ?? 0) + 1;
    return { id: `${char}-${counts[char]}`, char };
  });
};

export const createDefaultLogoState = (word: string): LogoState => ({
  gap: 0,
  letters: tokenize(word).map((token, index) => ({
    ...DEFAULT_LETTER,
    ...token,
    slot: index,
  })),
});

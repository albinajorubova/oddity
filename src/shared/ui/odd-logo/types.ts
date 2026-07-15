export type LetterState = {
  id: string;
  char: string;
  glyph?: string;

  slot: number;

  x: number;
  y: number;

  scale: number;
  scaleX: number;
  scaleY: number;
  rotate: number;

  color: string;
  opacity: number;

  fontWeight: number;

  skewX: number;
  skewY: number;

  blur: number;
  glow: number;
};

export type LogoState = {
  gap: number;
  letters: LetterState[];
};

export type LogoAction = (state: LogoState) => LogoState;

export const LOGO_COLORS = {
  black: "#000000",
  lime: "#bfff00",
} as const;

export const DEFAULT_LETTER: Omit<LetterState, "id" | "char" | "slot"> = {
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  color: LOGO_COLORS.black,
  opacity: 1,
  fontWeight: 700,
  skewX: 0,
  skewY: 0,
  blur: 0,
  glow: 0,
};

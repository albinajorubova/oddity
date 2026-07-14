/** Visual state of a single letter. DOM order is always identity. */
export type LetterState = {
  id: string;
  char: string;

  /**
   * Visual column (0-based). Default = identity index.
   * “Swap” effects exchange slots — never DOM order.
   */
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

/**
 * Logo tree. `letters` stay in fixed identity order (O,D,D,I,T,Y).
 * All oddness is transforms / slots / gap.
 */
export type LogoState = {
  /** Extra spacing in em, applied as composite X offset. */
  gap: number;
  letters: LetterState[];
};

/** Pure state transformer. Compose many to build a beat. */
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

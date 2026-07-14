import { gsap } from "gsap";

import type { LetterState, LogoState } from "../types";

export const LOGO_EASE = "expo.inOut";

export type AnimateLogoArgs = {
  root: HTMLElement;
  /** Target state tree — animation engine knows nothing else. */
  next: LogoState;
  duration: number;
};

const fontSizePx = (root: HTMLElement) =>
  Number.parseFloat(getComputedStyle(root).fontSize) || 16;

/** Extra spread/compress — keyed by visual slot so shuffle stays even. */
const gapOffsetPx = (
  root: HTMLElement,
  slot: number,
  count: number,
  gapEm: number,
) => {
  if (!gapEm || count <= 1) return 0;
  const center = (count - 1) / 2;
  return (slot - center) * gapEm * fontSizePx(root);
};

/** Measure letter widths in fixed DOM (identity) order. */
const measureWidths = (root: HTMLElement, letters: readonly LetterState[]) =>
  letters.map((letter) => {
    const node = root.querySelector<HTMLElement>(
      `[data-letter-style="${letter.id}"]`,
    );
    return node?.offsetWidth ?? fontSizePx(root) * 0.6;
  });

const prefixWidth = (widths: readonly number[], end: number) => {
  let sum = 0;
  for (let i = 0; i < end; i++) sum += widths[i] ?? 0;
  return sum;
};

/**
 * Map visual slot → identity index.
 * letters[i].slot = where letter i appears left→right.
 */
const buildVisualOrder = (letters: readonly LetterState[]) => {
  const order = Array.from({ length: letters.length }, () => -1);
  for (let identity = 0; identity < letters.length; identity++) {
    const slot = letters[identity]?.slot ?? identity;
    if (slot >= 0 && slot < order.length) order[slot] = identity;
  }
  // fill holes if any
  let cursor = 0;
  for (let s = 0; s < order.length; s++) {
    if (order[s] !== -1) continue;
    while (cursor < letters.length && order.includes(cursor)) cursor++;
    order[s] = cursor;
    cursor++;
  }
  return order;
};

/**
 * Pack letters by their real widths in visual order.
 * x = packedLeft(slot) − naturalLeft(identity)
 * → no empty gaps / overlaps from width mismatch.
 */
const reflowOffsetPx = (
  widths: readonly number[],
  letters: readonly LetterState[],
  identityIndex: number,
  slot: number,
) => {
  const visualOrder = buildVisualOrder(letters);
  const naturalLeft = prefixWidth(widths, identityIndex);

  let packedLeft = 0;
  for (let s = 0; s < slot; s++) {
    const who = visualOrder[s];
    if (who === undefined || who < 0) continue;
    packedLeft += widths[who] ?? 0;
  }

  return packedLeft - naturalLeft;
};

const letterVars = (
  root: HTMLElement,
  letter: LetterState,
  identityIndex: number,
  count: number,
  gap: number,
  widths: readonly number[],
  letters: readonly LetterState[],
) => ({
  x:
    letter.x +
    gapOffsetPx(root, letter.slot, count, gap) +
    reflowOffsetPx(widths, letters, identityIndex, letter.slot),
  y: letter.y,
  scaleX: letter.scale * letter.scaleX,
  scaleY: letter.scale * letter.scaleY,
  rotation: letter.rotate,
  skewX: letter.skewX,
  skewY: letter.skewY,
  autoAlpha: letter.opacity,
  color: letter.color,
  fontWeight: letter.fontWeight,
  filter:
    letter.blur > 0 || letter.glow > 0
      ? [
          letter.blur > 0 ? `blur(${letter.blur}px)` : null,
          letter.glow > 0
            ? `drop-shadow(0 0 ${letter.glow}px ${letter.color})`
            : null,
        ]
          .filter(Boolean)
          .join(" ")
      : "none",
});

/**
 * Animation layer — pure A → B tween on transforms only.
 * Shuffle uses width-aware reflow, not equal columns.
 */
export const animateLogo = ({
  root,
  next,
  duration,
}: AnimateLogoArgs): gsap.core.Timeline => {
  const tl = gsap.timeline({
    defaults: { ease: LOGO_EASE, overwrite: "auto" },
  });

  const count = next.letters.length;
  const widths = measureWidths(root, next.letters);

  for (let i = 0; i < count; i++) {
    const letter = next.letters[i];
    if (!letter) continue;

    const node = root.querySelector<HTMLElement>(
      `[data-letter-style="${letter.id}"]`,
    );
    if (!node) continue;

    tl.to(
      node,
      {
        ...letterVars(root, letter, i, count, next.gap, widths, next.letters),
        duration,
      },
      0,
    );
  }

  return tl;
};

export const setLogoInstant = (root: HTMLElement, next: LogoState) => {
  const count = next.letters.length;
  const widths = measureWidths(root, next.letters);

  for (let i = 0; i < count; i++) {
    const letter = next.letters[i];
    if (!letter) continue;

    const node = root.querySelector<HTMLElement>(
      `[data-letter-style="${letter.id}"]`,
    );
    if (!node) continue;

    gsap.set(
      node,
      letterVars(root, letter, i, count, next.gap, widths, next.letters),
    );
  }
};

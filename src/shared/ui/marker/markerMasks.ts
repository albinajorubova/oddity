/**
 * 6 high-quality Posca stroke masks.
 * Per-hover variety comes from motion transforms, not dozens of paths.
 */

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" preserveAspectRatio="none">${body}</svg>`;

const toMaskUrl = (markup: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;

const PATHS = [
  // press + fray
  `<path fill="#fff" fill-opacity="0.96" d="M3 16c12-6 28-2 42-5 16-3 28 8 46 4 14-3 26-9 40-4 12 4 24 2 36-2 10-3 20 4 28 8 4 2 6 6 4 11-3 8-14 6-22 9-14 5-26-1-40 3-16 5-30 8-46 3-14-4-26 2-40-2-10-3-20-8-28-6-6 1-8-4-6-10 1-4 4-8 10-9z"/>
   <path fill="#fff" fill-opacity="0.5" d="M8 11c4-1 8 1 6 4-3 2-8 1-10-1-1-2 1-3 4-3z"/>
   <path fill="#fff" fill-opacity="0.38" d="M210 34c3 0 6 2 5 4s-6 1-8-1c-1-2 0-3 3-3z"/>`,

  // soft upward drift
  `<path fill="#fff" fill-opacity="0.93" d="M2 22c18-8 36-10 54-6 20 4 38-6 56-2 18 4 34 10 52 6 14-3 28-1 40 5 6 3 8 8 5 12-6 8-20 4-30 2-18-4-34 2-52-2-16-4-34-10-50-6-18 4-36-2-52 2-10 3-20 1-26-4-4-4-2-10 3-13z"/>
   <path fill="#fff" fill-opacity="0.45" d="M70 14c5-2 11 0 9 3-2 3-9 2-11 0s0-2 2-3z"/>`,

  // choppy mid weight
  `<path fill="#fff" fill-opacity="0.94" d="M4 18c10-4 22 2 34-2 10-4 18 6 30 2 8-3 14-8 24-4 12 5 20-2 32 2 14 5 26 8 40 4 12-3 26 2 36 8 4 3 4 9-1 12-8 6-20 2-30 0-16-3-30-8-46-4-14 4-28 2-42-2-12-3-24 4-36 0-14-5-26-2-38 2-8 3-14-2-12-9 1-5 4-9 11-9z"/>
   <path fill="#fff" fill-opacity="0.4" d="M180 12c4-1 9 2 7 5-3 2-9 0-10-3 0-2 1-2 3-2z"/>`,

  // almost straight, torn edge
  `<path fill="#fff" fill-opacity="0.97" d="M1 17c20-2 40-4 60-2 22 2 42-2 64 0 20 2 42 4 62 1 12-2 24 2 32 6 3 2 4 7 1 10-5 6-16 4-25 5-20 2-40-2-60 0-22 2-44 4-66 1-18-2-36 2-52-1-10-2-18-6-16-12 1-4 5-7 11-8z"/>
   <path fill="#fff" fill-opacity="0.42" d="M100 12c6-1 12 1 10 4-3 2-11 1-13-1s0-2 3-3z"/>
   <path fill="#fff" fill-opacity="0.35" d="M30 30c4 0 8 2 6 4-3 2-9 0-9-2s1-2 3-2z"/>`,

  // double-drag ghost
  `<path fill="#fff" fill-opacity="0.5" d="M8 26c20-2 40 2 60-2 22-4 42 2 64 0 18-2 38-4 54 2 8 3 10 8 6 11-7 5-18 2-27 1-20-2-40 2-60 0-22-2-44-4-64-1-14 2-28-2-38-5-5-2-4-7 1-9 2-1 5-1 8 0z"/>
   <path fill="#fff" fill-opacity="0.94" d="M4 14c22-4 42 2 64-2 20-4 40-6 58 0 18 6 36 2 54 6 14 3 28-2 38 4 4 2 4 8-1 10-9 5-22 2-32 0-20-4-38 2-58-2-18-4-36-8-54-3-18 5-38-1-56 2-12 2-22-2-30-5-5-2-4-8 2-10 4-2 9-2 15 0z"/>`,

  // soft soak / bleed body
  `<path fill="#fff" fill-opacity="0.9" d="M6 18c26-8 52-4 78-8 22-3 42 6 64 2 20-4 40-6 58 2 10 4 18 2 26 7 4 2 4 8-1 11-9 6-22 4-32 2-20-4-40 2-60-2-18-4-38-8-56-3-20 5-42-1-62 3-14 3-28 5-40 0-7-3-6-10 0-13 4-2 10-3 15-1z"/>
   <ellipse cx="80" cy="28" rx="36" ry="8" fill="#fff" fill-opacity="0.28"/>
   <ellipse cx="170" cy="20" rx="24" ry="7" fill="#fff" fill-opacity="0.22"/>`,
] as const;

export const MARKER_MASKS = PATHS.map((body) => toMaskUrl(svg(body)));

export type MarkerMaskId = number;

export const pickMarkerMask = (previous: MarkerMaskId | null): MarkerMaskId => {
  const count = MARKER_MASKS.length;
  if (count <= 1) return 0;

  let next = Math.floor(Math.random() * count);
  if (previous !== null && next === previous) {
    next = (next + 1 + Math.floor(Math.random() * (count - 1))) % count;
  }
  return next;
};

export const getMarkerMask = (id: MarkerMaskId): string =>
  MARKER_MASKS[id] ?? MARKER_MASKS[0] ?? "";

import type { ScrollOptions } from "./types";

export const DEFAULT_SCROLL_OPTIONS: ScrollOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
};


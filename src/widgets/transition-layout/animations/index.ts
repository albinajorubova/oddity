export { archiveToHomeTransition } from "./archive-to-home";
export { fadeTransition } from "./fade";
export { homeToArchiveTransition } from "./home-to-archive";
export type {
  AnimationType,
  KillableAnimation,
  TransitionAnimation,
  TransitionAnimationParams,
} from "./types";

import { archiveToHomeTransition } from "./archive-to-home";
import { fadeTransition } from "./fade";
import { homeToArchiveTransition } from "./home-to-archive";
import type { AnimationType, TransitionAnimation } from "./types";

export const ANIMATION_FUNCTIONS: Record<
  AnimationType,
  TransitionAnimation
> = {
  "home-to-archive": homeToArchiveTransition,
  "archive-to-home": archiveToHomeTransition,
  fade: fadeTransition,
};

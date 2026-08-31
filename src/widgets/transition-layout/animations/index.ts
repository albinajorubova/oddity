export { collectionsToDetailTransition } from "./collections-to-detail";
export { detailToCollectionsTransition } from "./detail-to-collections";
export { fadeTransition } from "./fade";
export type {
  AnimationType,
  KillableAnimation,
  TransitionAnimation,
  TransitionAnimationParams,
} from "./types";

import { collectionsToDetailTransition } from "./collections-to-detail";
import { detailToCollectionsTransition } from "./detail-to-collections";
import { fadeTransition } from "./fade";
import type { AnimationType, TransitionAnimation } from "./types";

export const ANIMATION_FUNCTIONS: Record<AnimationType, TransitionAnimation> = {
  "collections-to-detail": collectionsToDetailTransition,
  "detail-to-collections": detailToCollectionsTransition,
  fade: fadeTransition,
};

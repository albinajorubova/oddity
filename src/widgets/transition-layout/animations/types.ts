export type KillableAnimation = { kill: () => void };

export type AnimationType =
  | "collections-to-detail"
  | "detail-to-collections"
  | "fade";

export type TransitionAnimationParams = {
  prevNode: HTMLElement | null;
  nextNode: HTMLElement | null;
  slug?: string;
  onComplete: () => void;
};

export type TransitionAnimation = {
  id: AnimationType;
  onLeave: (params: TransitionAnimationParams) => KillableAnimation | void;
};

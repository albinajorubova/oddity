export type StackSlot = {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
  brightness: number;
  zIndex: number;
};

/**
 * Fixed vertical composition from the reference:
 * bottom peek → top → middle → active/front.
 */
export const STACK_SLOTS: StackSlot[] = [
  {
    xPercent: 1,
    yPercent: 62,
    scale: 0.94,
    rotation: 0,
    brightness: 0.88,
    zIndex: 1,
  },
  {
    xPercent: 4,
    yPercent: 0,
    scale: 0.95,
    rotation: 0,
    brightness: 0.84,
    zIndex: 2,
  },
  {
    xPercent: 2,
    yPercent: 14,
    scale: 0.97,
    rotation: 0,
    brightness: 0.93,
    zIndex: 3,
  },
  {
    xPercent: 0,
    yPercent: 28,
    scale: 1,
    rotation: 0,
    brightness: 1,
    zIndex: 4,
  },
];

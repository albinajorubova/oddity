export const HERO_PHASES = {
  morphEnd: 0.45,
  expandEnd: 0.78,
} as const;

export const HERO_PROGRESS = {
  beginEpsilon: 0.01,
  endEpsilon: 0.999,
} as const;

export const HERO_ANIM = {
  /** Gallery fly-out travel as a fraction of viewport size */
  flyDistance: 0.6,
  /** Extra scale while gallery images fly out */
  flyScaleAmount: 0.15,
  /** Within expand phase: 0→liftRatio = rise to center, then grow size */
  expandLiftRatio: 0.42,
  /** Ease for lift / size grow: 1 - (1 - t)^power */
  expandEasePower: 1.45,
  /** Toggle object-fit cover after expand starts */
  expandActiveThreshold: 0.02,
  /** Starting border-radius (px) before expand flattens to 0 */
  expandBorderRadiusFrom: 12,
  /** z-index while the expand image covers the hero */
  expandZIndex: 5,
  /** Copy slide-in distance (px) */
  copyYOffset: 28,
} as const;

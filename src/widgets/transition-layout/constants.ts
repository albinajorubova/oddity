/**
 * Transition durations (seconds) for transition-layout.
 */
export const TRANSITION_DURATION = {
  /** DelayDelete — сколько держим старую страницу */
  DELAY_DELETE: 0.75,
  /** Morph card ↔ hero */
  MORPH: 0.65,
  /** Простой fade между прочими страницами */
  FADE: 0.35,
  /** Текст / chrome после morph */
  CONTENT_FADE: 0.4,
  /**
   * Когда можно начинать текст на detail.
   */
  CONTENT_IN: 0.28,
} as const;

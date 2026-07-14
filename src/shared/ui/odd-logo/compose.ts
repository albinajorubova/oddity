import { createDefaultLogoState } from "./letters";
import type { LogoAction, LogoState } from "./types";

/**
 * Apply a stack of atomic actions onto a base logo state.
 * Pure: same base + actions → same LogoState.
 */
export const composeLogoState = (
  actions: readonly LogoAction[],
  base: LogoState | string = "ODDITY",
): LogoState => {
  const initial =
    typeof base === "string"
      ? createDefaultLogoState(base)
      : structuredClone(base);

  return actions.reduce((state, action) => action(state), initial);
};

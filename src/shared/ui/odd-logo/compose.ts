import { createDefaultLogoState } from "./letters";
import type { LogoAction, LogoState } from "./types";

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

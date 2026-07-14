import { composeLogoState } from "../compose";
import type { LogoState } from "../types";
import type { BeatId } from "./config";
import { type BeatPicker, createBeatPicker } from "./picker";
import { BEAT_RECIPES } from "./presets";

const defaultPicker = createBeatPicker();

/**
 * Build one odd LogoState from a named beat recipe.
 * Pass a per-instance `picker` so cooldown stays local to the logo.
 */
export const createBeat = (
  wordOrState: string | LogoState = "ODDITY",
  picker: BeatPicker = defaultPicker,
  forced?: BeatId,
): LogoState => {
  const letterCount =
    typeof wordOrState === "string"
      ? wordOrState.length
      : wordOrState.letters.length;

  const beatId = forced ?? picker();
  const recipe = BEAT_RECIPES[beatId];

  return composeLogoState(recipe(letterCount), wordOrState);
};

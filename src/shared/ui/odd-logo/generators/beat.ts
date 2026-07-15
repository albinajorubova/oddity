import { composeLogoState } from "../compose";
import type { LogoState } from "../types";
import type { RecipeId } from "./config";
import { createRecipePicker, type RecipePicker } from "./picker";
import { RECIPES } from "./recipes";

const defaultPicker = createRecipePicker();

export const createBeat = (
  wordOrState: string | LogoState = "ODDITY",
  picker: RecipePicker = defaultPicker,
  forced?: RecipeId,
): LogoState => {
  const letterCount =
    typeof wordOrState === "string"
      ? wordOrState.length
      : wordOrState.letters.length;

  const recipeId = forced ?? picker();
  const actions = RECIPES[recipeId](letterCount);

  return composeLogoState(actions, wordOrState);
};

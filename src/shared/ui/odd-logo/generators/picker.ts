import type { RecipeId } from "./config";
import { RECIPE_IDS, RECIPE_WEIGHTS } from "./config";

export type RecipePicker = () => RecipeId;

export type BeatPicker = RecipePicker;

const pickWeighted = (
  ids: readonly RecipeId[],
  weights: Record<RecipeId, number>,
): RecipeId => {
  const total = ids.reduce((sum, id) => sum + (weights[id] ?? 0), 0);
  if (total <= 0) {
    return ids[0] ?? "accentColor";
  }

  let cursor = Math.random() * total;
  for (const id of ids) {
    cursor -= weights[id] ?? 0;
    if (cursor <= 0) return id;
  }

  return ids[ids.length - 1] ?? "accentColor";
};

export const createRecipePicker = (
  weights: Record<RecipeId, number> = RECIPE_WEIGHTS,
  cooldown = 3,
): RecipePicker => {
  const recent: RecipeId[] = [];

  return () => {
    const available = RECIPE_IDS.filter((id) => !recent.includes(id));
    const pool = available.length > 0 ? available : RECIPE_IDS;
    const next = pickWeighted(pool, weights);

    recent.push(next);
    if (recent.length > cooldown) {
      recent.shift();
    }

    return next;
  };
};

export const createBeatPicker = createRecipePicker;

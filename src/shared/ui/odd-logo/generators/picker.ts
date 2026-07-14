import type { BeatId } from "./config";
import { BEAT_IDS, BEAT_WEIGHTS } from "./config";

export type BeatPicker = () => BeatId;

const pickWeighted = (
  ids: readonly BeatId[],
  weights: Record<BeatId, number>,
): BeatId => {
  const total = ids.reduce((sum, id) => sum + (weights[id] ?? 0), 0);
  if (total <= 0) {
    return ids[0] ?? "spread";
  }

  let cursor = Math.random() * total;
  for (const id of ids) {
    cursor -= weights[id] ?? 0;
    if (cursor <= 0) return id;
  }

  return ids[ids.length - 1] ?? "spread";
};

/**
 * Weighted beat picker with short-term cooldown.
 * Prevents the same beat repeating within `cooldown` picks.
 */
export const createBeatPicker = (
  weights: Record<BeatId, number> = BEAT_WEIGHTS,
  cooldown = 3,
): BeatPicker => {
  const recent: BeatId[] = [];

  return () => {
    const available = BEAT_IDS.filter((id) => !recent.includes(id));
    const pool = available.length > 0 ? available : BEAT_IDS;
    const next = pickWeighted(pool, weights);

    recent.push(next);
    if (recent.length > cooldown) {
      recent.shift();
    }

    return next;
  };
};

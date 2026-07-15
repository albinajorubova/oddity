import type { LetterState, LogoAction, LogoState } from "../types";
import { clampIndex, updateLetter } from "../utils";

export type Target = number | readonly number[] | "all";

export type PerLetter<T> = T | ((index: number, count: number) => T);

export const resolveAmount = <T>(
  value: PerLetter<T>,
  index: number,
  count: number,
): T =>
  typeof value === "function"
    ? (value as (i: number, n: number) => T)(index, count)
    : value;

export const resolveTargets = (target: Target, count: number): number[] => {
  if (count <= 0) return [];
  if (target === "all") {
    return Array.from({ length: count }, (_, i) => i);
  }
  if (typeof target === "number") {
    return [clampIndex(target, count)];
  }
  return [...new Set(target.map((i) => clampIndex(i, count)))];
};

type LetterPatch = Partial<Omit<LetterState, "id" | "char">>;

export const apply =
  (target: Target, patch: PerLetter<LetterPatch>): LogoAction =>
  (state: LogoState) => {
    const count = state.letters.length;
    const indices = resolveTargets(target, count);

    return indices.reduce<LogoState>((next, index) => {
      const resolved = resolveAmount(patch, index, count);
      return updateLetter(next, index, resolved);
    }, state);
  };

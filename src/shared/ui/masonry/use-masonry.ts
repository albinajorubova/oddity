import { useMemo } from "react";

import { buildMasonry } from "./build-masonry";
import type { BuildMasonryOptions, MasonryItem } from "./types";

export const useMasonry = <T extends MasonryItem>(
  items: readonly T[],
  columnCount: number,
  options?: BuildMasonryOptions<T>,
): T[][] => {
  return useMemo(
    () => buildMasonry(items, columnCount, options),
    [items, columnCount, options],
  );
};

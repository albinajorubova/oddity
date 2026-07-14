import type {
  BuildMasonryOptions,
  MasonryColumnsConfig,
  MasonryItem,
  SelectColumnContext,
} from "./types";
import { DEFAULT_MASONRY_COLUMNS } from "./types";

export const indexOfSmallestHeight = (heights: readonly number[]): number => {
  let minIndex = 0;
  let minValue = heights[0] ?? 0;

  for (let i = 1; i < heights.length; i++) {
    const value = heights[i] ?? 0;
    if (value < minValue) {
      minValue = value;
      minIndex = i;
    }
  }

  return minIndex;
};

const defaultSelectColumn = <T extends MasonryItem>(
  ctx: SelectColumnContext<T>,
): number => indexOfSmallestHeight(ctx.heights);

export const buildMasonry = <T extends MasonryItem>(
  items: readonly T[],
  columnCount: number,
  options?: BuildMasonryOptions<T>,
): T[][] => {
  const count = Math.max(1, Math.floor(columnCount));
  const columns: T[][] = Array.from({ length: count }, () => []);
  const heights: number[] = Array.from({ length: count }, () => 0);
  const selectColumn = options?.selectColumn ?? defaultSelectColumn;

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];
    if (!item) continue;

    const columnIndex = selectColumn({
      item,
      itemIndex,
      heights,
      columns,
      columnCount: count,
    });

    const safeIndex = Math.min(Math.max(0, columnIndex), count - 1);

    columns[safeIndex]?.push(item);
    heights[safeIndex] = (heights[safeIndex] ?? 0) + Math.max(0, item.height);
  }

  return columns;
};

export const getMasonryColumnCount = (
  width: number,
  config: MasonryColumnsConfig = DEFAULT_MASONRY_COLUMNS,
): number => {
  for (const point of config.breakpoints) {
    if (width >= point.minWidth) {
      return point.columns;
    }
  }

  return config.defaultColumns;
};

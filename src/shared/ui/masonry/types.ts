export type MasonryItem = {
  id: string;
  height: number;
};

export type SelectColumnContext<T extends MasonryItem> = {
  item: T;
  itemIndex: number;
  heights: readonly number[];
  columns: readonly T[][];
  columnCount: number;
};

export type BuildMasonryOptions<T extends MasonryItem> = {
  selectColumn?: (ctx: SelectColumnContext<T>) => number;
};

export type MasonryColumnsConfig = {
  breakpoints: ReadonlyArray<{ minWidth: number; columns: number }>;
  defaultColumns: number;
};

export const DEFAULT_MASONRY_COLUMNS: MasonryColumnsConfig = {
  breakpoints: [
    { minWidth: 1280, columns: 5 },
    { minWidth: 1025, columns: 4 },
    { minWidth: 769, columns: 3 },
    { minWidth: 481, columns: 2 },
  ],
  defaultColumns: 1,
};

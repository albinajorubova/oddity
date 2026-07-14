"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback } from "react";
import clsx from "clsx";

import { MasonryItemSlot } from "./masonry-item-slot";
import type { BuildMasonryOptions, MasonryColumnsConfig } from "./types";
import { useItemHeights } from "./use-item-heights";
import { useMasonry } from "./use-masonry";
import { useMasonryColumns } from "./use-masonry-columns";

import s from "./masonry-grid.module.scss";

export type MasonryGridProps<T extends { id: string }> = {
  items: readonly T[];
  renderItem: (item: T, ctx: MasonryRenderContext) => ReactNode;
  estimateHeight?: (item: T) => number;
  columnCount?: number;
  columnsConfig?: MasonryColumnsConfig;
  masonryOptions?: BuildMasonryOptions<T & { height: number }>;
  className?: string;
  columnClassName?: string;
  itemClassName?: string;
  columnGap?: string;
  rowGap?: string;
};

export type MasonryRenderContext = {
  onLoad: () => void;
};

const defaultEstimateHeight = () => 1;

export const MasonryGrid = <T extends { id: string }>(
  props: MasonryGridProps<T>,
) => {
  const {
    items,
    renderItem,
    estimateHeight = defaultEstimateHeight,
    columnCount: columnCountProp,
    columnsConfig,
    masonryOptions,
    className,
    columnClassName,
    itemClassName,
    columnGap,
    rowGap,
  } = props;

  const responsiveColumns = useMasonryColumns(columnsConfig);
  const columnCount = columnCountProp ?? responsiveColumns;

  const { measuredItems, registerItem, notifyResize } = useItemHeights({
    items,
    estimateHeight,
  });

  const columns = useMasonry(measuredItems, columnCount, masonryOptions);

  const createOnLoad = useCallback(
    (id: string) => () => notifyResize(id),
    [notifyResize],
  );

  return (
    <div
      className={clsx(s.root, className)}
      style={
        {
          "--masonry-columns": columnCount,
          "--masonry-column-gap": columnGap,
          "--masonry-row-gap": rowGap,
        } as CSSProperties
      }
    >
      {columns.map((column, columnIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: column index is intentional
          key={`column-${columnIndex}`}
          className={clsx(s.column, columnClassName)}
        >
          {column.map((item) => (
            <MasonryItemSlot
              key={item.id}
              id={item.id}
              className={clsx(s.item, itemClassName)}
              register={registerItem}
            >
              {renderItem(item, { onLoad: createOnLoad(item.id) })}
            </MasonryItemSlot>
          ))}
        </div>
      ))}
    </div>
  );
};

MasonryGrid.displayName = "MasonryGrid";

"use client";

import { useCallback } from "react";
import clsx from "clsx";

import {
  ArchiveCard,
  type ArchiveItem,
  type ArchiveItemAspect,
} from "@entities/archive-card";

import { MasonryGrid } from "@shared/ui/masonry";
import { ARCHIVE_ITEMS_STUB } from "@/_pages/home/model";

import s from "./gallery.module.scss";

const ASPECT_ESTIMATE: Record<ArchiveItemAspect, number> = {
  square: 1,
  portrait: 1.5,
  tall: 1.67,
  landscape: 0.67,
  wide: 0.56,
};

const META_ESTIMATE = 0.22;

export type GallerySectionProps = {
  className?: string;
};

/** Навигация обычным Link — morph делает TransitionLayout (sync). */
export const GallerySection = (props: GallerySectionProps) => {
  const { className } = props;

  const estimateHeight = useCallback(
    (item: ArchiveItem) => ASPECT_ESTIMATE[item.aspect] + META_ESTIMATE,
    [],
  );

  return (
    <section id="gallery" className={clsx(s.root, className)}>
      <MasonryGrid
        items={ARCHIVE_ITEMS_STUB}
        estimateHeight={estimateHeight}
        className={s.masonry}
        renderItem={(item, { onLoad }) => (
          <ArchiveCard item={item} onImageLoad={onLoad} />
        )}
      />
    </section>
  );
};

GallerySection.displayName = "GallerySection";

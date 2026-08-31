"use client";

import { useCallback } from "react";
import clsx from "clsx";

import {
  CollectionCard,
  type CollectionItem,
  type CollectionItemAspect,
} from "@entities/collection-card";

import { MasonryGrid } from "@shared/ui/masonry";

import s from "./gallery.module.scss";

const ASPECT_ESTIMATE: Record<CollectionItemAspect, number> = {
  square: 1,
  portrait: 1.5,
  tall: 1.67,
  landscape: 0.67,
  wide: 0.56,
};

const META_ESTIMATE = 0.22;

export type GallerySectionProps = {
  className?: string;
  items: CollectionItem[];
};

/** Навигация обычным Link — morph делает TransitionLayout (sync). */
export const GallerySection = (props: GallerySectionProps) => {
  const { className, items } = props;

  const estimateHeight = useCallback(
    (item: CollectionItem) => ASPECT_ESTIMATE[item.aspect] + META_ESTIMATE,
    [],
  );

  return (
    <section id="gallery" className={clsx(s.root, className)}>
      {items.length === 0 ? (
        <p className="typo-micro">Nothing in the archive yet.</p>
      ) : (
        <MasonryGrid
          items={items}
          estimateHeight={estimateHeight}
          className={s.masonry}
          renderItem={(item, { onLoad }) => (
            <CollectionCard item={item} onImageLoad={onLoad} />
          )}
        />
      )}
    </section>
  );
};

GallerySection.displayName = "GallerySection";

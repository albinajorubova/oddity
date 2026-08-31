"use client";

import clsx from "clsx";

import { MediaImage } from "@shared/ui/media-image";
import type { CollectionCover } from "@/_pages/collection-detail/model";

import s from "./hero-cover.module.scss";

export type HeroCoverProps = {
  className?: string;
  cover: CollectionCover;
  slug: string;
};

export const HeroCover = (props: HeroCoverProps) => {
  const { className, cover, slug } = props;

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.stage} data-flip-id={slug} data-flip-role="hero">
        <MediaImage
          className={s.image}
          src={cover.url}
          alt={cover.alt}
          aspectRatio="1 / 1"
          sizes="42vw"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

HeroCover.displayName = "HeroCover";

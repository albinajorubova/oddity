"use client";

import clsx from "clsx";
import Image from "next/image";

import { collectionDetailPath } from "@shared/config";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";

import type { CollectionItem } from "./model";

import s from "./collection-card.module.scss";

export type CollectionCardProps = {
  className?: string;
  item: CollectionItem;
  onImageLoad?: () => void;
};

export const CollectionCard = (props: CollectionCardProps) => {
  const { className, item, onImageLoad } = props;

  const mods = mod(s, {
    aspect: item.aspect,
  });

  return (
    <Button
      href={collectionDetailPath(item.slug)}
      className={clsx(s.root, className, mods)}
    >
      <div
        className={s.media}
        data-flip-id={item.slug}
        data-flip-role="card"
      >
        <Image
          className={s.image}
          src={item.imageUrl}
          alt={`${item.artist} — ${item.title}`}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          onLoad={onImageLoad}
        />
      </div>
      <div className={s.meta}>
        <p className={clsx(s.artist, "typo-micro")}>{item.artist}</p>
        <p className="typo-p2">{item.title}</p>
        <p className={clsx(s.year, "typo-p2")}>{item.year}</p>
      </div>
    </Button>
  );
};

CollectionCard.displayName = "CollectionCard";

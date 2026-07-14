import clsx from "clsx";
import Image from "next/image";

import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";

import type { ArchiveItem } from "./model";

import s from "./archive-card.module.scss";

export type ArchiveCardProps = {
  className?: string;
  item: ArchiveItem;
  onImageLoad?: () => void;
};

export const ArchiveCard = (props: ArchiveCardProps) => {
  const { className, item, onImageLoad } = props;

  const mods = mod(s, {
    aspect: item.aspect,
  });

  return (
    <Button
      href={`/archive/${item.slug}`}
      className={clsx(s.root, className, mods)}
    >
      <div className={s.media}>
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
        <p className={s.artist}>{item.artist}</p>
        <p className={s.title}>{item.title}</p>
        <p className={s.year}>{item.year}</p>
      </div>
    </Button>
  );
};

ArchiveCard.displayName = "ArchiveCard";

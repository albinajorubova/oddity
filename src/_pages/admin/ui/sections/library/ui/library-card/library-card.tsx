"use client";

import clsx from "clsx";
import Image from "next/image";

import { adminCardPath } from "@shared/config";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";
import { type AdminCard, formatPublishStatus } from "@/_pages/admin/model";

import s from "./library-card.module.scss";

export type LibraryCardProps = {
  className?: string;
  card: AdminCard;
};

export const LibraryCard = (props: LibraryCardProps) => {
  const { className, card } = props;
  const aspectMod = mod(s, { aspect: card.aspect });

  return (
    <Button
      href={adminCardPath(card.slug)}
      className={clsx(s.root, className, aspectMod)}
    >
      <div className={s.media}>
        <Image
          className={s.image}
          src={card.imageUrl}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      <div className={s.meta}>
        <p className={clsx(s.status, "typo-micro")}>
          {formatPublishStatus(card.publishStatus)}
        </p>
        <p className={clsx(s.title, "typo-p2")}>{card.title}</p>
        <p className={clsx(s.credit, "typo-micro")}>{card.credit}</p>
        <p className={clsx(s.year, "typo-p2")}>{card.year ?? ""}</p>
      </div>
    </Button>
  );
};

LibraryCard.displayName = "LibraryCard";

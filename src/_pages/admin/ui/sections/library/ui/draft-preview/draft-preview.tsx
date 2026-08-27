"use client";

import clsx from "clsx";
import Image from "next/image";

import { adminCardPath } from "@shared/config";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";
import {
  type AdminCard,
  formatCardMeta,
  formatPublishStatus,
} from "@/_pages/admin/model";

import s from "./draft-preview.module.scss";

export type DraftPreviewProps = {
  className?: string;
  card: AdminCard;
};

export const DraftPreview = (props: DraftPreviewProps) => {
  const { className, card } = props;
  const aspectMod = mod(s, { aspect: card.aspect });

  return (
    <article className={clsx(s.root, className, aspectMod)}>
      <div className={s.media}>
        <Image
          className={s.image}
          src={card.imageUrl}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, 28vw"
        />
      </div>

      <div className={s.body}>
        <p className={clsx(s.status, "typo-micro")}>
          {formatPublishStatus(card.publishStatus)}
        </p>
        <p className={clsx(s.meta, "typo-micro")}>{formatCardMeta(card)}</p>
        <h2 className={clsx(s.title, "typo-h3")}>{card.title}</h2>
        <p className={clsx(s.description, "typo-p2")}>
          {card.shortDescription}
        </p>

        <div className={s.actions}>
          <Button
            href={adminCardPath(card.slug)}
            className={clsx(s.edit, "typo-caption")}
          >
            EDIT
          </Button>
          <Button type="button" className={clsx(s.publish, "typo-caption")}>
            PUBLISH
          </Button>
        </div>
      </div>
    </article>
  );
};

DraftPreview.displayName = "DraftPreview";

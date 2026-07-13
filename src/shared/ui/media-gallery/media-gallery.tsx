"use client";

import clsx from "clsx";
import type { ComponentProps } from "react";

import type { MediaWithBreakpoints } from "@/shared/types";
import { MediaImage } from "@shared/ui/media-image";
import { Video } from "@shared/ui/video";

import s from "./media-gallery.module.scss";

export type MediaGalleryItem = {
  id?: number;
  media?: MediaWithBreakpoints;
};

export type MediaGalleryProps = ComponentProps<"div"> & {
  title?: string;
  items?: MediaGalleryItem[];
};

const isVideo = (media: MediaWithBreakpoints | undefined): boolean => {
  if (!media?.default) return false;
  const mime = media.default.mime || "";
  return mime.startsWith("video/");
};

export const MediaGallery = (props: MediaGalleryProps) => {
  const { className, title, items = [], ...rest } = props;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={clsx(s.root, className)} {...rest}>
      {title && <h3 className={s.title}>{title}</h3>}

      <div className={s.grid}>
        {items.map((item, index) => {
          if (!item.media) return null;

          const key = item.id ?? index;

          if (isVideo(item.media)) {
            const videoUrl = item.media.default?.url;
            if (!videoUrl) return null;

            return (
              <div key={key} className={s.item}>
                <Video
                  src={videoUrl}
                  className={s.video}
                  muted
                  loop
                  autoPlay
                />
              </div>
            );
          }

          return (
            <div key={key} className={s.item}>
              <MediaImage source={item.media} className={s.image} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

MediaGallery.displayName = "MediaGallery";

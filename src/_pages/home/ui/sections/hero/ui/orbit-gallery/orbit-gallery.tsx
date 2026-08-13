"use client";

import { MediaImage } from "@shared/ui/media-image";
import type { HomeOrbitItem } from "@/_pages/home/model";
import { HOME_ORBIT_STUB } from "@/_pages/home/model";

import s from "./orbit-gallery.module.scss";

export type OrbitGalleryProps = {
  items?: HomeOrbitItem[];
};

export const OrbitGallery = (props: OrbitGalleryProps) => {
  const { items = HOME_ORBIT_STUB } = props;

  return (
    <div className={s.root} aria-hidden>
      {items.map((item) => (
        <figure key={item.id} className={s.item}>
          <MediaImage
            className={s.media}
            src={item.src}
            alt={item.alt}
            objectFit="contain"
            placeholder={false}
            sizes="30vw"
          />
        </figure>
      ))}
    </div>
  );
};

OrbitGallery.displayName = "OrbitGallery";

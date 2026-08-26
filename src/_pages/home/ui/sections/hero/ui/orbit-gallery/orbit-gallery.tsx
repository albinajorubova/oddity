"use client";

import type { Ref } from "react";

import { MediaImage } from "@shared/ui/media-image";
import type { HomeOrbitItem } from "@/_pages/home/model";
import { HOME_ORBIT_STUB } from "@/_pages/home/model";

import s from "./orbit-gallery.module.scss";

export type OrbitGalleryProps = {
  items?: HomeOrbitItem[];
  ref?: Ref<HTMLDivElement>;
};

export const OrbitGallery = (props: OrbitGalleryProps) => {
  const { items = HOME_ORBIT_STUB, ref } = props;

  return (
    <div className={s.root} ref={ref} aria-hidden>
      {items.map((item) => (
        <figure
          key={item.id}
          className={s.item}
          data-orbit-expand={item.expand ? "" : undefined}
        >
          <MediaImage
            className={s.media}
            src={item.src}
            alt={item.alt}
            objectFit={item.expand ? "cover" : "contain"}
            placeholder={false}
            sizes={item.expand ? "(min-width: 1280px) 70vw, 50vw" : "40vw"}
          />
        </figure>
      ))}
    </div>
  );
};

OrbitGallery.displayName = "OrbitGallery";

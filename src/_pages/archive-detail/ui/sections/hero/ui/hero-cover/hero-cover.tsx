import clsx from "clsx";

import { MediaImage } from "@shared/ui/media-image";
import type { ArchiveGallerySlide } from "@/_pages/archive-detail/model";

import s from "./hero-cover.module.scss";

export type HeroCoverProps = {
  className?: string;
  slides: ArchiveGallerySlide[];
  title: string;
};

export const HeroCover = (props: HeroCoverProps) => {
  const { className, slides, title } = props;
  const primary = slides[0];
  const secondary = slides[1];

  if (!primary) return null;

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.stage}>
        {secondary && (
          <div className={s.back} aria-hidden>
            <MediaImage
              className={s.image}
              src={secondary.url}
              alt=""
              aspectRatio="1 / 1"
              sizes="40vw"
            />
          </div>
        )}
        <div className={s.front}>
          <MediaImage
            className={s.image}
            src={primary.url}
            alt={primary.alt || title}
            aspectRatio="1 / 1"
            sizes="42vw"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

HeroCover.displayName = "HeroCover";

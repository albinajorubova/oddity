import clsx from "clsx";

import { StackGallery } from "@shared/ui/stack-gallery";
import type { ArchiveGallerySlide } from "@/_pages/archive-detail/model";

import s from "./hero-gallery.module.scss";

export type HeroGalleryProps = {
  className?: string;
  slides: ArchiveGallerySlide[];
  title: string;
};

export const HeroGallery = (props: HeroGalleryProps) => {
  const { className, slides, title } = props;

  if (slides.length === 0) return null;

  return (
    <div className={clsx(s.root, className)}>
      <StackGallery
        className={s.stack}
        activeIndex={Math.min(2, slides.length - 1)}
        images={slides.map((slide) => ({
          id: slide.id,
          src: slide.url,
          alt: slide.alt || title,
        }))}
      />

      <p className={s.viewHint} aria-hidden>
        <span>View</span>
        <span className={s.viewLine} />
      </p>
    </div>
  );
};

HeroGallery.displayName = "HeroGallery";

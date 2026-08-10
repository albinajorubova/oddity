"use client";

import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

import { MarkerHighlight } from "@shared/ui/marker";
import { MediaImage } from "@shared/ui/media-image";

import { animateStack } from "./animation";
import { STACK_SLOTS } from "./slots";

import s from "./stack-gallery.module.scss";

export type StackGalleryImage = {
  id?: string;
  src: string;
  alt?: string;
};

export type StackGalleryRenderContext = {
  index: number;
  total: number;
  image: StackGalleryImage;
};

export type StackGalleryProps = {
  className?: string;
  activeIndex?: number;
  images: StackGalleryImage[];
  onChange?: (index: number) => void;
};

export const StackGallery = ({
  className,
  images,
  activeIndex: initialIndex = 0,
  onChange,
}: StackGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)),
  );
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const hasMountedRef = useRef(false);
  const previousActiveRef = useRef(activeIndex);

  useLayoutEffect(() => {
    const immediate = !hasMountedRef.current;
    hasMountedRef.current = true;

    const animation = animateStack({
      cards: itemRefs.current.filter(Boolean),
      slots: STACK_SLOTS,
      activeIndex,
      previousActiveIndex: previousActiveRef.current,
      immediate,
    });

    previousActiveRef.current = activeIndex;

    return () => {
      animation?.kill();
    };
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    onChange?.(index);
  };

  if (!images.length) return null;

  const activeLabel = String(activeIndex + 1).padStart(2, "0");
  const totalLabel = String(images.length).padStart(2, "0");

  return (
    <div className={clsx(s.root, className)}>
      <div className={s.indexBar}>
        <div className={s.indexList}>
          {images.map((image, index) => {
            const imgNumber = String(index + 1).padStart(2, "0");
            const isActive = index === activeIndex;

            return (
              <button
                key={`index-${image.id ?? image.src}-${index}`}
                type="button"
                className={clsx(s.index, isActive && s.indexActive)}
                onClick={() => goTo(index)}
                aria-label={`Show image ${imgNumber}`}
                aria-current={isActive ? "true" : undefined}
              >
                <MarkerHighlight
                  color="lime"
                  variant="background"
                  active={isActive}
                >
                  {imgNumber}
                </MarkerHighlight>
              </button>
            );
          })}
        </div>

        <p className={s.indexCount} aria-hidden>
          <span className={s.indexCountCurrent}>{activeLabel}</span>
          <span className={s.indexCountSep}>/</span>
          {totalLabel}
        </p>
      </div>

      <ul className={s.stack}>
        {images.map((image, index) => {
          const imgNumber = String(index + 1).padStart(2, "0");
          const isActive = index === activeIndex;

          return (
            <li
              key={image.id ?? `${image.src}-${index}`}
              ref={(node) => {
                if (node) itemRefs.current[index] = node;
              }}
              className={clsx(s.item, isActive && s.itemActive)}
            >
              <button
                type="button"
                className={s.hit}
                onClick={() => goTo(index)}
                aria-label={`Show image ${imgNumber}`}
                aria-current={isActive ? "true" : undefined}
              >
                <MediaImage
                  className={s.image}
                  src={image.src}
                  alt={image.alt ?? ""}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

StackGallery.displayName = "StackGallery";

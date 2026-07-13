"use client";

import type { ComponentProps } from "react";
import { useRef } from "react";
import clsx from "clsx";

import type { MediaWithBreakpoints, RebuiltImage } from "@/shared/types";

import { useNaturalDimensions } from "./hooks/use-natural-dimensions";
import { usePlaceholder } from "./hooks/use-placeholder";
import { getSources } from "./utils/get-sources";
import { imgSizes } from "./utils/img-sizes";
import { resolveSource } from "./utils/resolve-source";

import s from "./media-image.module.scss";

export type MediaImageProps = ComponentProps<"div"> & {
  className?: string;
  altText?: string;
  alt?: string;
  src?: string;
  image?: RebuiltImage;
  source?: MediaWithBreakpoints;
  sizes?: string;
  height?: string | number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  fallbackAlt?: string;
  preloaded?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  aspectRatio?: string;
  placeholder?: boolean;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
};

export const DEFAULT_SIZES = imgSizes({
  md: 100,
  default: 50,
});

export const MediaImage = (props: MediaImageProps) => {
  const {
    className,
    source,
    image,
    sizes = DEFAULT_SIZES,
    src,
    height,
    altText: propAltText,
    alt,
    loading = "lazy",
    fetchPriority,
    fallbackAlt,
    preloaded = true,
    objectFit,
    aspectRatio,
    placeholder = true,
    onLoad,
    ...rest
  } = props;

  const $root = useRef<HTMLDivElement | null>(null);
  const $image = useRef<HTMLImageElement | null>(null);
  const $picture = usePlaceholder(placeholder);

  const altText = propAltText || alt || fallbackAlt;

  const finalSource = resolveSource({ src, image, source });
  const sources = finalSource ? getSources(finalSource, sizes) : [];
  const lastSource = sources[sources.length - 1];
  const fallbackSrc = lastSource?.src;

  useNaturalDimensions({
    ref: $image,
    targetRef: $root,
    src: fallbackSrc,
    onLoad,
  });

  if (!finalSource || sources.length === 0) {
    return null;
  }

  return (
    <div
      ref={$root}
      className={clsx(s.root, className)}
      style={height !== undefined ? { height } : undefined}
      {...rest}
    >
      <picture
        ref={$picture}
        className={clsx(s.picture, { [s.placeholder]: placeholder })}
      >
        {sources.map((sourceItem) => (
          <source
            key={sourceItem.breakpointSize}
            srcSet={sourceItem.srcSet}
            media={sourceItem.media}
            sizes={sourceItem.sizes}
            type={sourceItem.type}
          />
        ))}
        <img
          ref={$image}
          className={s.image}
          src={fallbackSrc}
          alt={altText || lastSource?.altText || ""}
          data-preloaded={preloaded}
          loading={loading}
          fetchPriority={fetchPriority}
          height={
            aspectRatio ? undefined : finalSource.default?.height || undefined
          }
          width={
            aspectRatio ? undefined : finalSource.default?.width || undefined
          }
          style={
            {
              ...(aspectRatio ? { aspectRatio, height: "auto" } : {}),
              "--object-fit": objectFit || "cover",
            } as React.CSSProperties
          }
        />
      </picture>
    </div>
  );
};

MediaImage.displayName = "MediaImage";

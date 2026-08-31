import type { RefObject } from "react";
import { useEffect } from "react";

const setDimensionVariables = (
  target: HTMLElement,
  image: HTMLImageElement,
) => {
  target.style.setProperty("--natural-width", String(image.naturalWidth));
  target.style.setProperty("--natural-height", String(image.naturalHeight));
  target.style.setProperty(
    "--aspect-ratio",
    String(image.naturalWidth / image.naturalHeight),
  );
};

type UseNaturalDimensionsParams = {
  ref: RefObject<HTMLImageElement | null>;
  targetRef: RefObject<HTMLElement | null>;
  src?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
};

/**
 * Выставляет CSS-переменные с натуральными размерами изображения
 * (--natural-width, --natural-height, --aspect-ratio) на родителе
 * элемента targetRef, если он существует.
 */
export const useNaturalDimensions = ({
  ref,
  targetRef,
  src,
  onLoad,
}: UseNaturalDimensionsParams) => {
  useEffect(() => {
    const image = ref.current;
    if (!image || !src) return;

    const prevLoad = image.onload;

    const imageLoaded = (e: Event) => {
      const parent = targetRef.current?.parentElement;
      if (parent) {
        setDimensionVariables(parent, image);
      }

      onLoad?.(e as unknown as React.SyntheticEvent<HTMLImageElement, Event>);
      prevLoad?.call(image, e);
      image.onload = null;
    };

    if (image.complete) {
      imageLoaded(new Event("load"));
    } else {
      image.onload = imageLoaded;
    }

    return () => {
      image.onload = prevLoad;
    };
  }, [ref, targetRef, src, onLoad]);
};

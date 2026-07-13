import { useEffect, useRef } from "react";

const animationPreloader = (el: HTMLElement, duration?: number) => {
  el.style.setProperty("--placeholder-loading", "0");
  el.style.setProperty(
    "--placeholder-loading-transition",
    duration ? `opacity ${duration}s cubic-bezier(0.37, 0, 0.63, 1)` : "none",
  );
};

export const usePlaceholder = (isEnable: boolean) => {
  const pictureRef = useRef<HTMLPictureElement | null>(null);

  useEffect(() => {
    if (!isEnable) return;

    requestAnimationFrame(() => {
      const startPreloadTime = Date.now();

      const picture = pictureRef.current;
      const image = picture?.lastChild;
      const htmlImage = image instanceof HTMLImageElement ? image : null;

      if (!picture || !htmlImage || htmlImage.complete) return;

      const onLoadImage = () => {
        const endPreloaderTime = Date.now();
        const dt = endPreloaderTime - startPreloadTime;

        animationPreloader(picture, dt < 10 ? 0 : 0.6);
        htmlImage.removeEventListener("load", onLoadImage);
      };

      picture?.style.setProperty("--placeholder-loading", "1");
      htmlImage.addEventListener("load", onLoadImage);
    });
  }, [isEnable]);

  return pictureRef;
};

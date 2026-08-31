"use client";

import { useEffect } from "react";
import {
  usePreloaderActions,
  // usePreloaderStore,
} from "@widgets/preloader/model/preloaderStore";
import gsap from "gsap";

import { round } from "@shared/utils";
import { loaderAllImages } from "@shared/utils/loaders/image";

export const usePreloader = (delay = 0, additionalResources: string[]) => {
  const { setPercents } = usePreloaderActions();
  // const { additionalData } = usePreloaderStore();

  const handleLoad = () => {
    const images = document.querySelectorAll("img[data-preloaded]");
    const sources = [...images, ...additionalResources].map((img) => {
      const src = typeof img === "string" ? img : img?.getAttribute("src");
      return src || "";
    });

    if (images.length <= 0) {
      setPercents(1);
      return;
    }

    const p = {
      value: 0,
    };

    loaderAllImages(
      sources,
      delay,
      () => {},
      ({ loaded, length }) => {
        gsap.to(p, {
          value: loaded / length,
          overwrite: true,
          onUpdate: () => {
            setPercents(round(p.value, 2));
          },
        });
      },
    );
  };

  useEffect(() => {
    handleLoad();

    return () => {
      setPercents(0);
      console.log("reset percent");
    };
  }, []);
};

import { useEffect } from "react";
import type Lenis from "lenis";

import { usePreloaderStore } from "@/widgets/preloader/model/preloaderStore";

export const usePreloaderScrollStop = (scroll: Lenis) => {
  const isStartEndAnimation = usePreloaderStore(
    (state) => state.isStartEndAnimation,
  );

  useEffect(() => {
    if (!scroll) return;

    if (isStartEndAnimation) {
      scroll.start();
      scroll.scrollTo(0, {
        force: true,
        immediate: true,
      });
    } else {
      scroll.stop();
    }
  }, [isStartEndAnimation, scroll]);
};

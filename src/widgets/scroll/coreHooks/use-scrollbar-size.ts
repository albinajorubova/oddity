import { useEffect } from "react";
import type Lenis from "lenis";

import { setStyle } from "@/shared/utils/set-style";

const getScrollbarSize = (element: HTMLElement) => {
  return {
    width: window.innerWidth - element.clientWidth,
    height: window.innerHeight - element.clientHeight,
  };
};

export const useScrollbarSize = (lenis: Lenis) => {
  useEffect(() => {
    if (!lenis) return;

    const onResize = () => {
      const content = lenis.rootElement.children[0];
      if (!content) return;

      const scrollbarSize = getScrollbarSize(content as HTMLElement);
      setStyle(
        window.document.documentElement,
        "--scrollbar-width",
        `${scrollbarSize.width}px`,
      );
    };

    onResize();
    lenis.rootElement.addEventListener("resize-scroll", onResize);

    return () => {
      lenis.rootElement.removeEventListener("resize-scroll", onResize);
    };
  }, [lenis]);
};

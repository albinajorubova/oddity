import { useEffect } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import type Lenis from "lenis";
import { usePathname } from "next/navigation";

import { useResizeObserver } from "@/shared/hooks/use-resize-observer";

export const useScrollTrigger = (scroll: Lenis) => {
  const pathname = usePathname();

  useEffect(() => {
    scroll?.resize();
  }, [pathname]);

  const [setElement] = useResizeObserver(
    {
      callback: () => {
        scroll?.resize();
        scroll?.rootElement.dispatchEvent(new Event("resize-scroll"));
        ScrollTrigger.refresh();
      },
    },
    [scroll],
  );

  useEffect(() => {
    if (!scroll) return;
    setElement(scroll?.rootElement.children[0] || null);
  }, [scroll]);
};

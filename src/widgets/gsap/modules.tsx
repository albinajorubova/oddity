"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import { Observer } from "gsap/dist/Observer";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type Lenis from "lenis";
import { usePathname } from "next/navigation";

import { useResizeObserver } from "@/shared/hooks/use-resize-observer";
import { useScroll } from "@/widgets/scroll/hooks/use-scroll";

declare global {
  interface Window {
    __GLOBAL_SCROLL__: Lenis;
  }
}

export const Modules = () => {
  useEffect(() => {
    gsap.registerPlugin(CustomEase, ScrollToPlugin, ScrollTrigger, Observer);

    /* CustomEase */
    CustomEase.create("quartIn", "0.5, 0, 0.75, 0");

    /* ScrollTrigger */
    ScrollTrigger.clearScrollMemory("manual");
    ScrollTrigger.defaults({ scroller: "#scroll" });
  }, []);

  const lenis = useScroll(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (lenis) window.__GLOBAL_SCROLL__ = lenis;
  }, [lenis]);

  const pathname = usePathname();

  useEffect(() => {
    window.__GLOBAL_SCROLL__?.resize();
  }, [pathname]);

  const [setElement] = useResizeObserver({
    callback: () => {
      window.__GLOBAL_SCROLL__?.rootElement.dispatchEvent(
        new Event("before-resize-scroll"),
      );
      window.__GLOBAL_SCROLL__?.resize();
      window.__GLOBAL_SCROLL__?.rootElement.dispatchEvent(
        new Event("resize-scroll"),
      );

      ScrollTrigger.refresh();
    },
  });

  useEffect(() => {
    // for scroll wrapper
    setElement(document.querySelector("#scroll")?.children[0] || null);

    // for app root
    // setElement(document.querySelector("#app-root"));
  }, []);

  return null;
};

Modules.displayName = "Modules";

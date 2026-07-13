import { useEffect } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import type Lenis from "lenis";

import {
  EVENTS_TRANSITION_LAYOUT,
  transitionLayoutEmitter,
} from "@/widgets/transition-layout/emmiter";

export const useScrollPageTransition = (scroll: Lenis) => {
  useEffect(() => {
    if (!scroll) return;

    const onPageStart = () => {
      scroll.start();
    };

    const onPageOutStart = () => {
      scroll.stop();
    };

    const onPageOutUnmount = () => {
      scroll?.resize();
      scroll?.rootElement.dispatchEvent(new Event("resize-scroll"));
      ScrollTrigger.refresh();
    };

    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageInComplete,
      onPageStart,
    );
    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageOutStart,
      onPageOutStart,
    );
    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
      onPageOutUnmount,
    );

    return () => {
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageInComplete,
        onPageStart,
      );
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageOutStart,
        onPageOutStart,
      );
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
        onPageOutUnmount,
      );
    };
  }, [scroll]);
};

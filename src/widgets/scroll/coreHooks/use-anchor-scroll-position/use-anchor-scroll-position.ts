import { useEffect } from "react";
import {
  EVENTS_TRANSITION_LAYOUT,
  transitionLayoutEmitter,
} from "@widgets/transition-layout/emmiter";
import type Lenis from "lenis";
import { useRouter } from "next/router";

import { getAnchorId } from "./utils/getAnchorId";
import { getScrollPosition } from "./utils/getScrollPosition";

export const useAnchorScrollPosition = (
  scroll: Lenis,
  isRoot: boolean,
  isWrapper: boolean,
) => {
  const router = useRouter();

  useEffect(() => {
    if (!scroll) return;
    if (!isRoot) return;

    const getAnchorElement = () => {
      const id = getAnchorId();

      if (!id) return null;

      return isWrapper
        ? scroll.rootElement.querySelector(id || "")
        : document.querySelector(id || "");
    };

    const onhashchangeComplete = () => {
      const el = getAnchorElement();

      if (el && scroll) {
        const nextScroll = getScrollPosition(el as HTMLElement);
        const scrollStart = scroll.rootElement.scrollTop;

        scroll.rootElement.scrollTo(0, scrollStart);

        setTimeout(() => {
          if (scroll) {
            scroll.rootElement.scrollTo(0, scrollStart);
            scroll.scrollTo(nextScroll, {
              force: true,
            });
          }
        }, 0);
      }
    };

    const onPageStart = () => {
      const el = getAnchorElement();

      if (el && scroll) {
        const nextScroll = getScrollPosition(el as HTMLElement);

        scroll.scrollTo(nextScroll, {
          force: true,
          immediate: true,
        });
      }
    };

    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
      onPageStart,
    );
    router.events.on("hashChangeComplete", onhashchangeComplete);

    return () => {
      router.events.off("hashChangeComplete", onhashchangeComplete);
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
        onPageStart,
      );
    };
  }, [scroll]);
};

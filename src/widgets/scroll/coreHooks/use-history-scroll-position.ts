import { useEffect } from "react";
import type Lenis from "lenis";
import { useRouter } from "next/router";

import {
  EVENTS_TRANSITION_LAYOUT,
  transitionLayoutEmitter,
} from "@/widgets/transition-layout/emmiter";

export const historyScroll = new Map<string, number>();
export const historyScrollHeight = new Map<string, number>();
export const historyScrollRef = { scrollPopstate: false };

export const useHistoryScrollPosition = (scroll: Lenis, isRoot: boolean) => {
  const router = useRouter();

  useEffect(() => {
    if (!scroll) return;
    if (!isRoot) return;

    const onPageStart = () => {
      if (historyScrollRef.scrollPopstate) {
        const scrollPosition = historyScroll.get(window.location.pathname);

        scroll.scrollTo(0, {
          force: true,
          immediate: true,
        });

        if (scrollPosition) {
          scroll.scrollTo(scrollPosition, {
            force: true,
            immediate: true,
          });
        }
      } else {
        scroll.scrollTo(0, {
          force: true,
          immediate: true,
        });
      }

      historyScrollRef.scrollPopstate = false;
    };

    const onPopState = () => {
      historyScrollRef.scrollPopstate = true;
    };

    const onRouteChangeStart = () => {
      historyScroll.set(window.next.router.asPath.split("?")[0], scroll.scroll);
      historyScrollHeight.set(
        window.next.router.asPath.split("?")[0],
        scroll.dimensions.scrollHeight - scroll.dimensions.height,
      );
    };

    window.addEventListener("popstate", onPopState);
    router.events.on("routeChangeStart", onRouteChangeStart);
    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
      onPageStart,
    );

    return () => {
      window.removeEventListener("popstate", onPopState);
      router.events.off("routeChangeStart", onRouteChangeStart);
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageOutUnmount,
        onPageStart,
      );
    };
  }, [scroll, isRoot]);
};

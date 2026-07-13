import { forwardRef, type RefObject } from "react";
import clsx from "clsx";
import type Lenis from "lenis";

import { composeRefs } from "@shared/utils/compose-refs";

import { ScrollContext } from "./context";
import {
  useAnchorScrollPosition,
  useCreateScroll,
  useHistoryScrollPosition,
  usePreloaderScrollStop,
  useScrollbarSize,
  useScrollPageTransition,
  useScrollTrigger,
  useStopScrollOnOpenMenu,
  useSubscribeScroll,
} from "./coreHooks";
import type { ScrollProps } from "./types";

import s from "./scroll.module.scss";

export const Scroll = forwardRef<HTMLElement, ScrollProps>(
  (
    {
      as: As = "div",
      children,
      wrapper = true,
      root = true,
      className,
      contentClassName,
      options = {},
    },
    ref,
  ) => {
    const [scroll, wrapRef, contentRef] = useCreateScroll(
      root,
      wrapper,
      options as ScrollOptions,
    );

    useScrollPageTransition(scroll as Lenis);
    useStopScrollOnOpenMenu(root);
    useScrollTrigger(scroll as Lenis);
    useHistoryScrollPosition(scroll as Lenis, root);
    useAnchorScrollPosition(scroll as Lenis, root, wrapper);
    useScrollbarSize(scroll as Lenis);
    usePreloaderScrollStop(scroll as Lenis);

    const value = useSubscribeScroll(scroll as Lenis);

    return (
      <ScrollContext.Provider value={value}>
        {!wrapper ? (
          children
        ) : (
          <As
            id={root ? "scroll" : undefined}
            className={clsx(s.wrap, className)}
            ref={composeRefs(ref, wrapRef as RefObject<HTMLElement>)}
          >
            <div
              className={clsx(s.content, contentClassName)}
              ref={contentRef as RefObject<HTMLDivElement>}
            >
              {children}
            </div>
          </As>
        )}
      </ScrollContext.Provider>
    );
  },
);

Scroll.displayName = "Scroll";

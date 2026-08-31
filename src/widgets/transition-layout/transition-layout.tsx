"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import clsx from "clsx";
import type { NextRouter } from "next/router";

import { DelayDelete, SwitchElement } from "@shared/ui/animate-presence";

import { ANIMATION_FUNCTIONS, type AnimationType } from "./animations";
import { TRANSITION_DURATION } from "./constants";
import { TransitionLayoutContext } from "./context/transition-layout-context";
import { EVENTS_TRANSITION_LAYOUT, transitionLayoutEmitter } from "./emmiter";
import { getAnimationType } from "./utils/get-animation-type";

import s from "./transition-layout.module.scss";

export type TransitionLayoutProps = {
  children: React.ReactNode;
  router: NextRouter;
};

/**
 * Sync page transitions (как Artem / vanilla):
 * старая и новая страница живут вместе → morph → pageOutUnmount.
 */
export const TransitionLayout = memo(
  ({ router, children }: TransitionLayoutProps) => {
    const [, setTransitionStarted] = useState(false);
    const transitionStartedRef = useRef(false);
    const activeTweensRef = useRef<Set<{ kill: () => void }>>(new Set());

    const prevRouterRef = useRef<string | null>(null);
    const prevSlugRef = useRef<string | undefined>(undefined);

    useEffect(() => {
      const onStart = () => {
        prevRouterRef.current = router.route;
        prevSlugRef.current = router.query?.slug as string | undefined;
      };
      router.events.on("routeChangeStart", onStart);
      return () => {
        router.events.off("routeChangeStart", onStart);
      };
    }, [router.events, router.route, router.query?.slug]);

    const key = `${router.route}-${router.locale}-${router.query?.slug ?? ""}`;
    const prevKeyRef = useRef(key);

    if (prevKeyRef.current !== key) {
      transitionStartedRef.current = true;
      prevKeyRef.current = key;
    }

    const killPending = useCallback(() => {
      activeTweensRef.current.forEach((t) => t.kill());
      activeTweensRef.current.clear();
    }, []);

    useEffect(() => () => killPending(), [killPending]);

    const onLeaveComplete = useCallback(() => {
      flushSync(() => {
        setTransitionStarted(false);
        transitionStartedRef.current = false;
      });

      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.resetScroll);
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutUnmount);
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageInComplete);
    }, []);

    const onTransition = useCallback(
      (nextNode: HTMLElement | null, prevNode: HTMLElement | null) => {
        killPending();
        setTransitionStarted(true);

        transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutStart);

        const slug =
          (router.query?.slug as string | undefined) ?? prevSlugRef.current;

        const animationType: AnimationType = getAnimationType({
          prevRoute: prevRouterRef.current,
          nextRoute: router.route,
          slug,
        });

        const effectiveSlug =
          animationType === "detail-to-collections"
            ? prevSlugRef.current
            : slug;

        if (prevNode) {
          prevNode.classList.add(s.pageOut);
        }

        const tween = ANIMATION_FUNCTIONS[animationType].onLeave({
          prevNode,
          nextNode,
          slug: effectiveSlug,
          onComplete: () => {
            if (tween) activeTweensRef.current.delete(tween);
            transitionLayoutEmitter.send(
              EVENTS_TRANSITION_LAYOUT.pageOutComplete,
            );
            if (nextNode) {
              nextNode.classList.remove(s.pageEnter);
            }
          },
        });

        if (tween) {
          activeTweensRef.current.add(tween);
        }
      },
      [killPending, router.query?.slug, router.route],
    );

    const entering = transitionStartedRef.current;

    return (
      <SwitchElement
        mode="sync"
        transitionKey={key}
        onLeaveComplete={onLeaveComplete}
        onTransition={onTransition}
      >
        <DelayDelete timeout={TRANSITION_DURATION.DELAY_DELETE}>
          {({ ref, isVisible }) => (
            <main
              ref={ref}
              className={clsx(
                isVisible && entering && [s.pageFixed, s.pageEnter],
              )}
            >
              <TransitionLayoutContext.Provider
                value={{
                  isVisible: isVisible && !transitionStartedRef.current,
                  transitionStarted: transitionStartedRef.current,
                }}
              >
                {children}
              </TransitionLayoutContext.Provider>
            </main>
          )}
        </DelayDelete>
      </SwitchElement>
    );
  },
);

TransitionLayout.displayName = "TransitionLayout";

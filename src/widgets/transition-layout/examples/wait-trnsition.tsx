import { memo, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import type { NextRouter } from "next/router";

import { DelayDelete, SwitchElement } from "@shared/ui/animate-presence";

import { TransitionLayoutContext } from "../context/transition-layout-context";
import { EVENTS_TRANSITION_LAYOUT, transitionLayoutEmitter } from "../emmiter";

import s from "../transition-layout.module.scss";

const TRANSITION_DURATION = 0.4;

export type TransitionLayoutProps = {
  children: React.ReactNode;
  router: NextRouter;
};

export const TransitionLayout = memo(
  ({ router, children }: TransitionLayoutProps) => {
    const [_, setTransitionStarted] = useState(false);

    const $block = useRef<HTMLDivElement>(null);
    const activeTweensRef = useRef<Set<{ kill: () => void }>>(new Set());

    const key = `${router.route}-${router.locale}-${router.query?.slug}`;
    const transitionStartedRef = useRef(false);
    const prevKeyRef = useRef(key);

    if (prevKeyRef.current !== key) {
      transitionStartedRef.current = true;
      prevKeyRef.current = key;
    }

    const onEnter = useCallback((_node: HTMLElement | null) => {
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageInStart);
      transitionLayoutEmitter.send(
        EVENTS_TRANSITION_LAYOUT.pageInCompleteStart,
      );

      const tween = gsap.to($block.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          activeTweensRef.current.delete(tween);
          transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageInComplete);
        },
      });
      activeTweensRef.current.add(tween);
    }, []);

    const onLeave = useCallback((_node: HTMLElement | null) => {
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutStart);
      setTransitionStarted(true);

      const tween = gsap.to($block.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          activeTweensRef.current.delete(tween);
          transitionLayoutEmitter.send(
            EVENTS_TRANSITION_LAYOUT.pageOutComplete,
          );
        },
      });
      activeTweensRef.current.add(tween);
    }, []);

    const onLeaveComplete = useCallback(() => {
      flushSync(() => {
        setTransitionStarted(false);
        transitionStartedRef.current = false;
      });
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.resetScroll);
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutUnmount);
    }, []);

    return (
      <>
        <div ref={$block} className={s.block} />
        <SwitchElement
          mode="wait"
          transitionKey={key}
          onLeaveComplete={onLeaveComplete}
          onEnter={onEnter}
          onLeave={onLeave}
        >
          <DelayDelete timeout={TRANSITION_DURATION}>
            {({ ref, isVisible }) => (
              <main ref={ref}>
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
      </>
    );
  },
);

TransitionLayout.displayName = "TransitionLayout";

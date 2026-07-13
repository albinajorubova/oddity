import { memo, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import type { NextRouter } from "next/router";

import { DelayDelete, SwitchElement } from "@shared/ui/animate-presence";

import { TransitionLayoutContext } from "../context/transition-layout-context";
import s from "../transition-layout.module.scss";

export type TransitionLayoutExampleProps = {
  children: React.ReactNode;
  router: NextRouter;

  /**
   * Exists only to keep parity with the real widget props.
   * This example doesn`t need it.
   */
  pageName: string;
};

/**
 * Example-only version of `TransitionLayout`.
 *
 * This file intentionally contains only the “approach”:
 * - overlay block (inline-highlighted) + GSAP-driven open/close
 * - fixed `main` container while `transitionStartedRef` is true
 * - "top" offset applied to the first inner child (to keep content stable)
 * - the order of function calls inside `onTransition`
 */
export const TransitionLayoutExample = memo(
  ({ router, children }: TransitionLayoutExampleProps) => {
    // For sync mode we need a state change to trigger rerender.
    const [_, setTransitionStarted] = useState(false);

    const $block = useRef<HTMLDivElement>(null);
    const transitionStartedRef = useRef(false);

    const activeRafIdsRef = useRef<Set<number>>(new Set());
    const activeTweensRef = useRef<Set<{ kill: () => void }>>(new Set());

    const mainTopShiftRef = useRef<{
      el: HTMLElement | null;
      prevTop: string;
    }>({ el: null, prevTop: "" });

    const killPendingAnimations = useCallback(() => {
      activeRafIdsRef.current.forEach((id) => {
        cancelAnimationFrame(id);
      });
      activeRafIdsRef.current.clear();
      activeTweensRef.current.forEach((t) => {
        t.kill();
      });
      activeTweensRef.current.clear();
    }, []);

    // Keep `isVisible` stable after the transition starts.
    // In the real widget this is tied to a preloader store.
    const isFinishEndAnimation = true;

    const key = `${router.route}-${router.locale}`;
    const prevKeyRef = useRef(key);

    if (prevKeyRef.current !== key) {
      transitionStartedRef.current = true;
      prevKeyRef.current = key;
    }

    useEffect(() => {
      return () => killPendingAnimations();
    }, [killPendingAnimations]);

    const applyTopShift = useCallback((main: HTMLElement) => {
      const firstChild = main.children[0] as HTMLElement | undefined;
      if (!firstChild) return;

      mainTopShiftRef.current = {
        el: firstChild,
        prevTop: firstChild.style.top,
      };

      // Example-only value: shift the first child by the current scroll.
      // The important part is the “top” manipulation + reset order.
      const scrollY = window.scrollY ?? 0;
      firstChild.style.top = `${scrollY * -1}px`;
    }, []);

    const resetTopShift = useCallback(() => {
      const { el, prevTop } = mainTopShiftRef.current;
      if (!el) return;
      el.style.top = prevTop;
      mainTopShiftRef.current = { el: null, prevTop: "" };
    }, []);

    const onLeave = useCallback((prevNode: HTMLElement | null) => {
      // Disable interactions on outgoing content early.
      if (prevNode) prevNode.style.pointerEvents = "none";

      // Overlay expands (from empty) to cover the screen.
      // We keep CSS variables animation because this is the core approach.
      let tween: gsap.core.Tween | gsap.core.Timeline | null = null;
      tween = gsap.fromTo(
        $block.current,
        {
          opacity: 0,
          "--width": "0svh",
          "--height": "0svh",
          "--border-radius": "64px",
        },
        {
          opacity: 1,
          "--width": "160svh",
          "--height": "160svh",
          "--border-radius": "0px",
          pointerEvents: "none",
          duration: 0.7,
          ease: "power1.inOut",
          onComplete: () => {
            if (!tween) return;
            activeTweensRef.current.delete(
              tween as unknown as {
                kill: () => void;
              },
            );
          },
        },
      );

      if (tween) {
        activeTweensRef.current.add(tween as unknown as { kill: () => void });
      }
    }, []);

    const onEnter = useCallback((nextNode: HTMLElement | null) => {
      const node = nextNode;

      // Overlay closes back to nothing.
      const tween = gsap.to($block.current, {
        opacity: 0,
        "--width": "0svh",
        "--height": "0svh",
        "--border-radius": "64px",
        duration: 0.5,
        delay: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          activeTweensRef.current.delete(
            tween as unknown as { kill: () => void },
          );
          if (node) node.style.pointerEvents = "auto";
        },
      });

      activeTweensRef.current.add(tween as unknown as { kill: () => void });
    }, []);

    const onLeaveComplete = useCallback(() => {
      flushSync(() => {
        setTransitionStarted(false);
        transitionStartedRef.current = false;
      });

      // Reset internal top offset after the transition ends.
      resetTopShift();
    }, [resetTopShift]);

    const onTransition = useCallback(
      (nextNode: HTMLElement | null, prevNode: HTMLElement | null) => {
        /*
         * Order requirement (example):
         * 1) stop previous animations
         * 2) start transition state (so `main` becomes fixed)
         * 3) apply internal "top" shift
         * 4) run leave (outgoing)
         * 5) run enter (incoming)
         */
        killPendingAnimations();
        setTransitionStarted(true);

        if (nextNode) applyTopShift(nextNode);

        onLeave(prevNode);
        onEnter(nextNode);
      },
      [applyTopShift, killPendingAnimations, onEnter, onLeave],
    );

    return (
      <>
        <div
          ref={$block}
          className={s.blockExample}
          style={{
            // Example-only highlight: makes the overlay boundaries obvious.
            outline: "2px dashed rgba(255, 0, 0, 0.7)",
            outlineOffset: "-2px",
            boxShadow: "0 0 0 2px rgba(255, 0, 0, 0.12)",

            // Start hidden; `onLeave` will animate it in.
            opacity: 0,
          }}
          aria-hidden="true"
        >
          {/* Inline label keeps this example self-contained. */}
          <div
            className={s.blockLabelExample}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",

              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
              fontSize: "12px",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.92)",

              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "999px",

              margin: "16px",
              padding: "6px 10px",
            }}
          >
            overlay block
          </div>
        </div>

        <SwitchElement
          mode="sync"
          transitionKey={key}
          onLeaveComplete={onLeaveComplete}
          onTransition={onTransition}
        >
          <DelayDelete timeout={1.2}>
            {({ ref, isVisible }) => (
              <main
                ref={ref}
                style={
                  // While sync transition is running we temporarily fix `main`.
                  isVisible && transitionStartedRef.current
                    ? {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        minHeight: "100svh",
                        zIndex: "var(--z-page)",
                        overflowY: "scroll",
                        overflowX: "clip",

                        // Example-only visual cue.
                        outline: "2px solid rgba(0, 180, 255, 0.55)",
                        outlineOffset: "-2px",
                        background: "rgba(0, 180, 255, 0.05)",
                      }
                    : undefined
                }
              >
                <TransitionLayoutContext.Provider
                  value={{
                    isVisible:
                      isVisible &&
                      !transitionStartedRef.current &&
                      isFinishEndAnimation,
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

TransitionLayoutExample.displayName = "TransitionLayoutExample";

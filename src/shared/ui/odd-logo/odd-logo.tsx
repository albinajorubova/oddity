"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";

import { animateLogo, setLogoInstant } from "./animation";
import { createBeat, createBeatPicker } from "./generators";
import { createDefaultLogoState } from "./letters";
import type { LogoState } from "./types";

import s from "./odd-logo.module.scss";

export type OddLogoProps = {
  text?: string;
  className?: string;
  /** Transition duration (seconds). */
  duration?: number;
  /** Min idle gap between beats (ms). */
  idleMinMs?: number;
  /** Max idle gap between beats (ms). */
  idleMaxMs?: number;
  /** How long an odd beat stays before returning home (ms). */
  oddHoldMs?: number;
  /** Delay before intro beat on load (ms). */
  introDelayMs?: number;
};

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const OddLogo = (props: OddLogoProps) => {
  const {
    text = "ODDITY",
    className,
    duration = 0.55,
    idleMinMs = 15_000,
    idleMaxMs = 30_000,
    oddHoldMs = 900,
    introDelayMs = 900,
  } = props;

  const baseState = useMemo(() => createDefaultLogoState(text), [text]);
  /** Fixed DOM identity — never reordered. */
  const letters = baseState.letters;
  const pickBeat = useMemo(() => createBeatPicker(), []);

  const rootRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<LogoState>(baseState);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timersRef = useRef<gsap.core.Tween[]>([]);
  const reducedMotionRef = useRef(false);
  const busyRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) timer.kill();
    timersRef.current = [];
  }, []);

  const schedule = useCallback((delayMs: number, fn: () => void) => {
    const tween = gsap.delayedCall(delayMs / 1000, fn);
    timersRef.current.push(tween);
    return tween;
  }, []);

  const goTo = useCallback(
    (next: LogoState, animate: boolean) => {
      const root = rootRef.current;
      if (!root) return;

      currentRef.current = next;
      timelineRef.current?.kill();

      if (!animate || reducedMotionRef.current) {
        setLogoInstant(root, next);
        return;
      }

      timelineRef.current = animateLogo({ root, next, duration });
    },
    [duration],
  );

  const playBeatThenHome = useCallback(
    (nextDelayMs: number) => {
      if (busyRef.current || reducedMotionRef.current) {
        schedule(nextDelayMs, () =>
          playBeatThenHome(randomBetween(idleMinMs, idleMaxMs)),
        );
        return;
      }

      busyRef.current = true;
      goTo(createBeat(baseState, pickBeat), true);

      schedule(oddHoldMs, () => {
        goTo(baseState, true);
        busyRef.current = false;
        schedule(nextDelayMs, () =>
          playBeatThenHome(randomBetween(idleMinMs, idleMaxMs)),
        );
      });
    },
    [baseState, goTo, idleMaxMs, idleMinMs, oddHoldMs, pickBeat, schedule],
  );

  useEffect(() => {
    currentRef.current = baseState;
    const root = rootRef.current;
    if (root) setLogoInstant(root, baseState);
  }, [baseState]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;

    const onMotionChange = () => {
      reducedMotionRef.current = media.matches;
      if (media.matches) {
        clearTimers();
        busyRef.current = false;
        goTo(baseState, false);
      }
    };

    media.addEventListener("change", onMotionChange);

    schedule(introDelayMs, () => {
      playBeatThenHome(randomBetween(idleMinMs, idleMaxMs));
    });

    return () => {
      media.removeEventListener("change", onMotionChange);
      clearTimers();
      timelineRef.current?.kill();
      const root = rootRef.current;
      if (root) {
        gsap.killTweensOf(root);
        gsap.killTweensOf(root.querySelectorAll("[data-letter-style]"));
      }
    };
  }, [
    baseState,
    clearTimers,
    goTo,
    idleMaxMs,
    idleMinMs,
    introDelayMs,
    playBeatThenHome,
    schedule,
  ]);

  const onHover = () => {
    if (reducedMotionRef.current || busyRef.current) return;
    clearTimers();
    busyRef.current = true;
    goTo(createBeat(baseState, pickBeat), true);
  };

  const onLeave = () => {
    if (reducedMotionRef.current) return;
    goTo(baseState, true);
    busyRef.current = false;
    schedule(randomBetween(idleMinMs, idleMaxMs), () =>
      playBeatThenHome(randomBetween(idleMinMs, idleMaxMs)),
    );
  };

  return (
    <span
      ref={rootRef}
      className={clsx(s.root, className)}
      aria-hidden
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {letters.map((letter) => (
        <span
          key={letter.id}
          className={s.letter}
          data-letter-style={letter.id}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};

OddLogo.displayName = "OddLogo";

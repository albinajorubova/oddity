"use client";

import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";

import { createLogoController } from "./controller";
import { createDefaultLogoState } from "./letters";

import s from "./odd-logo.module.scss";

export type OddLogoProps = {
  text?: string;
  className?: string;
  duration?: number;
  idleMinMs?: number;
  idleMaxMs?: number;
  oddHoldMs?: number;
  introDelayMs?: number;
  hoverCooldownMs?: number;
};

export const OddLogo = (props: OddLogoProps) => {
  const {
    text = "ODDITY",
    className,
    duration = 0.55,
    idleMinMs = 15_000,
    idleMaxMs = 30_000,
    oddHoldMs = 900,
    introDelayMs = 900,
    hoverCooldownMs = 400,
  } = props;

  const baseState = useMemo(() => createDefaultLogoState(text), [text]);
  const letters = baseState.letters;

  const rootRef = useRef<HTMLSpanElement>(null);
  const baseStateRef = useRef(baseState);
  baseStateRef.current = baseState;

  const controller = useMemo(
    () =>
      createLogoController({
        getRoot: () => rootRef.current,
        getBaseState: () => baseStateRef.current,
        duration,
        idleMinMs,
        idleMaxMs,
        oddHoldMs,
        introDelayMs,
        hoverCooldownMs,
      }),
    [duration, hoverCooldownMs, idleMaxMs, idleMinMs, introDelayMs, oddHoldMs],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    controller.setReducedMotion(media.matches);
    controller.reset(true);

    const onMotionChange = () => {
      controller.setReducedMotion(media.matches);
      if (!media.matches) controller.start();
    };

    media.addEventListener("change", onMotionChange);
    if (!media.matches) controller.start();

    return () => {
      media.removeEventListener("change", onMotionChange);
      controller.destroy();
    };
  }, [baseState, controller]);

  const onHover = () => {
    if (!controller.canPlay("hover")) return;
    controller.playHover();
  };

  const onLeave = () => {
    controller.resumeIdle();
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

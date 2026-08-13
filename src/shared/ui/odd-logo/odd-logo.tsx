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
  disabled?: boolean;
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
    hoverCooldownMs = 50,
    disabled = false,
  } = props;

  const baseState = useMemo(() => createDefaultLogoState(text), [text]);
  const letters = baseState.letters;

  const rootRef = useRef<HTMLSpanElement>(null);
  const baseStateRef = useRef(baseState);
  baseStateRef.current = baseState;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

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

    const onMotionChange = () => {
      controller.setReducedMotion(media.matches);
      if (disabledRef.current || media.matches) {
        controller.reset(true);
        return;
      }
      controller.start();
    };

    media.addEventListener("change", onMotionChange);

    return () => {
      media.removeEventListener("change", onMotionChange);
      controller.destroy();
    };
  }, [baseState, controller]);

  useEffect(() => {
    if (disabled) {
      controller.reset(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    controller.start();
  }, [disabled, controller]);

  const onHover = () => {
    if (disabled) return;
    if (!controller.canPlay("hover")) return;
    controller.playHover();
  };

  return (
    <span
      ref={rootRef}
      className={clsx(s.root, className)}
      aria-hidden
      onMouseEnter={onHover}
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

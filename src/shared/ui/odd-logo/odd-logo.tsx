"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
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
  idle?: boolean;
  disabled?: boolean;
};

export type OddLogoHandle = {
  setDisabled: (disabled: boolean) => void;
};

export const OddLogo = forwardRef<OddLogoHandle, OddLogoProps>((props, ref) => {
  const {
    text = "ODDITY",
    className,
    duration = 0.55,
    idleMinMs = 15_000,
    idleMaxMs = 30_000,
    oddHoldMs = 900,
    introDelayMs = 900,
    hoverCooldownMs = 50,
    idle = true,
    disabled = false,
  } = props;

  const baseState = useMemo(() => createDefaultLogoState(text), [text]);
  const letters = baseState.letters;

  const rootRef = useRef<HTMLSpanElement>(null);
  const baseStateRef = useRef(baseState);
  baseStateRef.current = baseState;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const idleRef = useRef(idle);
  idleRef.current = idle;

  const controller = useMemo(
    () =>
      createLogoController({
        getRoot: () => rootRef.current,
        getBaseState: () => baseStateRef.current,
        getIdleEnabled: () => idleRef.current,
        duration,
        idleMinMs,
        idleMaxMs,
        oddHoldMs,
        introDelayMs,
        hoverCooldownMs,
      }),
    [duration, hoverCooldownMs, idleMaxMs, idleMinMs, introDelayMs, oddHoldMs],
  );

  const syncController = () => {
    if (disabledRef.current) {
      controller.reset(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      controller.reset(true);
      return;
    }
    if (idleRef.current) {
      controller.start();
      return;
    }
    controller.reset(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      setDisabled: (next) => {
        disabledRef.current = next;
        syncController();
      },
    }),
    [controller],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    controller.setReducedMotion(media.matches);

    const onMotionChange = () => {
      controller.setReducedMotion(media.matches);
      syncController();
    };

    media.addEventListener("change", onMotionChange);

    return () => {
      media.removeEventListener("change", onMotionChange);
      controller.destroy();
    };
  }, [baseState, controller]);

  useEffect(() => {
    syncController();
  }, [disabled, idle, controller]);

  const onHover = () => {
    if (disabledRef.current) return;
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
});

OddLogo.displayName = "OddLogo";

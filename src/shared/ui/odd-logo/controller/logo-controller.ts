import { gsap } from "gsap";

import { animateLogo, setLogoInstant } from "../animation";
import {
  createBeat,
  createRecipePicker,
  type RecipePicker,
} from "../generators";
import type { LogoState } from "../types";

export type PlaySource = "idle" | "hover" | "intro";

export type LogoPhase = "idle" | "playing" | "hover" | "returning";

export type LogoControllerOptions = {
  getRoot: () => HTMLElement | null;
  getBaseState: () => LogoState;
  duration: number;
  idleMinMs: number;
  idleMaxMs: number;
  oddHoldMs: number;
  introDelayMs: number;
  /** Min gap between hover plays (ms). */
  hoverCooldownMs?: number;
  pickRecipe?: RecipePicker;
};

export type LogoController = {
  canPlay: (source: PlaySource) => boolean;
  playHover: () => void;
  start: () => void;
  destroy: () => void;
  setReducedMotion: (value: boolean) => void;
  reset: (instant?: boolean) => void;
  phase: () => LogoPhase;
};

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const createLogoController = (
  options: LogoControllerOptions,
): LogoController => {
  const {
    getRoot,
    getBaseState,
    duration,
    idleMinMs,
    idleMaxMs,
    oddHoldMs,
    introDelayMs,
    hoverCooldownMs = 1200,
    pickRecipe = createRecipePicker(),
  } = options;

  let phase: LogoPhase = "idle";
  let reducedMotion = false;
  let lastHoverAt = 0;
  let timeline: gsap.core.Timeline | null = null;
  const timers: gsap.core.Tween[] = [];

  const clearTimers = () => {
    for (const timer of timers) timer.kill();
    timers.length = 0;
  };

  const schedule = (delayMs: number, fn: () => void) => {
    const tween = gsap.delayedCall(delayMs / 1000, fn);
    timers.push(tween);
    return tween;
  };

  const nextIdleDelay = () => randomBetween(idleMinMs, idleMaxMs);

  const goTo = (next: LogoState, animate: boolean) => {
    const root = getRoot();
    if (!root) return;

    timeline?.kill();
    timeline = null;

    if (!animate || reducedMotion) {
      setLogoInstant(root, next);
      return;
    }

    timeline = animateLogo({ root, next, duration });
  };

  const goHome = (animate: boolean) => {
    goTo(getBaseState(), animate);
  };

  const playIdleBeat = () => {
    if (!canPlay("idle")) {
      schedule(nextIdleDelay(), playIdleBeat);
      return;
    }

    phase = "playing";
    goTo(createBeat(getBaseState(), pickRecipe), true);

    schedule(oddHoldMs, () => {
      phase = "returning";
      goHome(true);
      phase = "idle";
      schedule(nextIdleDelay(), playIdleBeat);
    });
  };

  const canPlay = (source: PlaySource): boolean => {
    if (reducedMotion) return false;

    if (source === "hover") {
      // Hover can interrupt idle "playing"; blocked only during active hover / return.
      if (phase === "hover" || phase === "returning") return false;
      if (Date.now() - lastHoverAt < hoverCooldownMs) return false;
      return true;
    }

    if (source === "idle" || source === "intro") {
      return phase === "idle";
    }

    return false;
  };

  const playHover = () => {
    if (!canPlay("hover")) return;

    clearTimers();
    lastHoverAt = Date.now();
    phase = "hover";
    goTo(createBeat(getBaseState(), pickRecipe), true);

    schedule(oddHoldMs, () => {
      phase = "returning";
      goHome(true);

      schedule(duration * 1000, () => {
        phase = "idle";
        schedule(nextIdleDelay(), playIdleBeat);
      });
    });
  };

  const start = () => {
    clearTimers();
    phase = "idle";
    schedule(introDelayMs, playIdleBeat);
  };

  const reset = (instant = true) => {
    clearTimers();
    phase = "idle";
    goHome(!instant);
  };

  const destroy = () => {
    clearTimers();
    timeline?.kill();
    timeline = null;
    phase = "idle";

    const root = getRoot();
    if (root) {
      gsap.killTweensOf(root);
      gsap.killTweensOf(root.querySelectorAll("[data-letter-style]"));
    }
  };

  const setReducedMotion = (value: boolean) => {
    reducedMotion = value;
    if (value) {
      clearTimers();
      phase = "idle";
      goHome(false);
    }
  };

  return {
    canPlay,
    playHover,
    start,
    destroy,
    setReducedMotion,
    reset,
    phase: () => phase,
  };
};

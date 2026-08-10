"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

import {
  jitter,
  MARKER_COLORS,
  MARKER_DRAW_EASE,
  MARKER_MOTION,
  randomBetween,
  transformOriginFor,
} from "./markerConfig";
import {
  getMarkerMask,
  type MarkerMaskId,
  pickMarkerMask,
} from "./markerMasks";
import type { MarkerColor, MarkerDirection, MarkerVariant } from "./types";

import s from "./marker.module.scss";

export type {
  MarkerColor,
  MarkerDirection,
  MarkerVariant,
} from "./types";

export type MarkerHighlightProps = {
  children: ReactNode;
  className?: string;
  color?: MarkerColor;
  variant?: MarkerVariant;
  direction?: MarkerDirection;
  disabled?: boolean;
  active?: boolean;
  duration?: number;
};

const DRAW_EASE = "markerDraw";

const ensureDrawEase = () => {
  if (typeof window === "undefined") return "power1.out";
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get(DRAW_EASE)) {
    try {
      CustomEase.create(DRAW_EASE, MARKER_DRAW_EASE);
    } catch {
      return "power1.out";
    }
  }
  return DRAW_EASE;
};

const resolveColor = (color: MarkerColor = "lime") =>
  MARKER_COLORS[color] ?? color;

const EPS = 0.001;

export const MarkerHighlight = (props: MarkerHighlightProps) => {
  const {
    children,
    className,
    color = "lime",
    variant = "background",
    direction = "ltr",
    disabled = false,
    active = false,
    duration = MARKER_MOTION.duration,
  } = props;

  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeRef = useRef<HTMLSpanElement>(null);
  const layersRef = useRef<HTMLSpanElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const bleedRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastMaskRef = useRef<MarkerMaskId | null>(null);
  const activeRef = useRef(false);
  const disabledRef = useRef(disabled);
  const forcedActiveRef = useRef(active);
  const durationRef = useRef(duration);
  const directionRef = useRef(direction);
  const playInRef = useRef<() => void>(() => undefined);
  const playOutRef = useRef<() => void>(() => undefined);

  disabledRef.current = disabled;
  forcedActiveRef.current = active;
  durationRef.current = duration;
  directionRef.current = direction;

  useEffect(() => {
    const stroke = strokeRef.current;
    const layers = layersRef.current;
    if (!stroke || !layers) return;

    const origin = transformOriginFor(directionRef.current);
    gsap.set(stroke, {
      scaleX: EPS,
      scaleY: 1,
      rotation: 0,
      y: 0,
      transformOrigin: origin,
      force3D: true,
    });
    gsap.set(layers, {
      scaleX: 1 / EPS,
      scaleY: 1,
      rotation: 0,
      y: 0,
      transformOrigin: origin,
      force3D: true,
    });

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const playIn = () => {
      if (disabledRef.current || activeRef.current) return;

      const stroke = strokeRef.current;
      const layers = layersRef.current;
      const ink = inkRef.current;
      const bleed = bleedRef.current;
      if (!stroke || !layers || !ink || !bleed) return;

      activeRef.current = true;
      timelineRef.current?.kill();

      const dir = directionRef.current;
      const origin = transformOriginFor(dir);
      const m = MARKER_MOTION;

      const maskId = pickMarkerMask(lastMaskRef.current);
      lastMaskRef.current = maskId;
      const mask = getMarkerMask(maskId);
      ink.style.setProperty("--marker-mask", mask);
      bleed.style.setProperty("--marker-mask", mask);

      const enter = jitter(durationRef.current, m.durationJitter);
      const overshoot = randomBetween(m.overshoot.min, m.overshoot.max);
      const inkOpacity = randomBetween(m.inkOpacity.min, m.inkOpacity.max);
      const bleedOpacity = randomBetween(
        m.bleedOpacity.min,
        m.bleedOpacity.max,
      );
      const y = randomBetween(m.yOffset.min, m.yOffset.max);
      const tilt =
        randomBetween(m.tilt.min, m.tilt.max) +
        randomBetween(-m.tiltJitter, m.tiltJitter);
      const pressureStart = randomBetween(
        m.pressure.start.min,
        m.pressure.start.max,
      );
      const pressureMid = randomBetween(m.pressure.mid.min, m.pressure.mid.max);
      const pressureEnd = randomBetween(m.pressure.end.min, m.pressure.end.max);

      const varRotate = randomBetween(
        m.variation.rotate.min,
        m.variation.rotate.max,
      );
      const varScaleX = randomBetween(
        m.variation.scaleX.min,
        m.variation.scaleX.max,
      );
      const varScaleY = randomBetween(
        m.variation.scaleY.min,
        m.variation.scaleY.max,
      );
      const varY = randomBetween(m.variation.y.min, m.variation.y.max);

      ink.style.setProperty("--marker-ink", String(inkOpacity));
      bleed.style.setProperty("--marker-bleed", String(bleedOpacity));

      // Wipe via scaleX on clipper + inverse on layers (GPU, mask stays sharp).
      const progress = { p: EPS };

      gsap.set(stroke, {
        scaleX: EPS,
        scaleY: pressureStart,
        rotation: tilt * 0.35,
        y,
        transformOrigin: origin,
      });
      gsap.set(layers, {
        scaleX: (1 / EPS) * varScaleX,
        scaleY: varScaleY,
        rotation: varRotate,
        y: varY,
        transformOrigin: origin,
      });

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      timelineRef.current = tl;

      tl.to(
        progress,
        {
          p: overshoot,
          duration: enter,
          ease: ensureDrawEase(),
          onUpdate: () => {
            const p = Math.max(progress.p, EPS);
            gsap.set(stroke, { scaleX: p });
            gsap.set(layers, { scaleX: (1 / p) * varScaleX });
          },
        },
        0,
      );

      // Pressure + wrist tilt on the stroke shell.
      tl.to(
        stroke,
        {
          scaleY: pressureMid,
          rotation: tilt,
          duration: enter * m.hand.midAt,
          ease: "power1.out",
        },
        0,
      );
      tl.to(
        stroke,
        {
          scaleY: pressureEnd,
          rotation: 0,
          duration: enter * (1 - m.hand.midAt),
          ease: "power1.inOut",
        },
        enter * m.hand.midAt,
      );
    };

    const playOut = () => {
      if (disabledRef.current || !activeRef.current) return;
      if (forcedActiveRef.current) return;
      const stroke = strokeRef.current;
      const layers = layersRef.current;
      if (!stroke || !layers) return;

      activeRef.current = false;
      timelineRef.current?.kill();

      const origin = transformOriginFor(directionRef.current);
      const exit = Math.min(
        MARKER_MOTION.exitMax,
        durationRef.current * MARKER_MOTION.exitRatio,
      );

      const currentX = Number(gsap.getProperty(stroke, "scaleX")) || EPS;
      const progress = { p: Math.max(currentX, EPS) };

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      timelineRef.current = tl;

      tl.to(progress, {
        p: EPS,
        duration: exit,
        ease: "power1.in",
        onUpdate: () => {
          const p = Math.max(progress.p, EPS);
          gsap.set(stroke, { scaleX: p, transformOrigin: origin });
          gsap.set(layers, { scaleX: 1 / p, transformOrigin: origin });
        },
      });
      tl.to(
        stroke,
        {
          scaleY: 1,
          rotation: 0,
          y: 0,
          duration: exit,
          ease: "power1.in",
        },
        0,
      );
    };

    playInRef.current = playIn;
    playOutRef.current = playOut;

    root.addEventListener("pointerenter", playIn);
    root.addEventListener("pointerleave", playOut);

    const focusParent = root.closest("a, button");
    focusParent?.addEventListener("focus", playIn);
    focusParent?.addEventListener("blur", playOut);

    return () => {
      root.removeEventListener("pointerenter", playIn);
      root.removeEventListener("pointerleave", playOut);
      focusParent?.removeEventListener("focus", playIn);
      focusParent?.removeEventListener("blur", playOut);
    };
  }, []);

  useEffect(() => {
    if (active) playInRef.current();
    else playOutRef.current();
  }, [active]);

  const style = {
    "--marker-color": resolveColor(color),
  } as CSSProperties;

  return (
    <span
      ref={rootRef}
      className={clsx(s.root, s[variant], s[direction], className)}
      style={style}
    >
      <span ref={strokeRef} className={s.stroke} aria-hidden>
        <span ref={layersRef} className={s.layers}>
          <span ref={bleedRef} className={s.bleed} />
          <span ref={inkRef} className={s.ink} />
        </span>
      </span>
      <span className={s.label}>{children}</span>
    </span>
  );
};

MarkerHighlight.displayName = "MarkerHighlight";

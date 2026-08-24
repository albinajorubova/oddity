"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useCurrentBreakpoint } from "@app/model/viewport-store/hooks";
import { gsap } from "gsap";

import { useResizeObserver } from "@shared/hooks/use-resize-observer";
import useValueUpdate from "@shared/hooks/use-value-update";
import type { BreakpointKeys } from "@shared/types";
import { throttleRAF } from "@shared/utils/throttleRAF";

import type { BgMorphDirection, MorphPoints, MorphSizes } from "./utils";
import { morphConcat } from "./utils";

const closeState = "M744 0 L744 1304 L744 1304 Q744 652 744 0 Z";

const offsets: Partial<Record<BreakpointKeys, number>> = {
  xs: 0.15,
  sm: 0.15,
  md: 0.3,
  lg: 0.5,
  xl: 0.5,
  "2xl": 0.5,
};

export type BgMorphDelay = {
  in: number;
  out: number;
};

export type BgMorphProps = {
  className?: string;
  isOpen: boolean;
  direction?: BgMorphDirection;
  onComplete?: (isOpenAnimation: boolean) => void;
  duration?: number;
  uniqSvgId: string;
  delay?: BgMorphDelay;
};

export const BgMorph = memo(
  ({
    className,
    isOpen,
    direction = "top",
    onComplete,
    duration = 1,
    uniqSvgId,
    delay = { in: 0, out: 0 },
  }: BgMorphProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const refPath = useRef<SVGPathElement | null>(null);
    const morphFunc = useMemo(() => morphConcat(direction), [direction]);

    // Stable objects that GSAP mutates over time.
    const points = useMemo<MorphPoints>(
      () => ({
        start: 0,
        center: 0,
        offset: 0,
      }),
      [],
    );

    const sizes = useMemo<MorphSizes>(
      () => ({
        width: 0,
        height: 0,
      }),
      [],
    );

    const [[width, height], setSize] = useState<[number, number]>([0, 0]);

    const currentBreakpoint = useCurrentBreakpoint() as BreakpointKeys;

    const updateMorph = useCallback(() => {
      const data = morphFunc(sizes, points);
      refPath.current?.setAttribute("d", data);
    }, [morphFunc]);

    // React resets path `d={closeState}` on re-render; re-apply GSAP morph after paint.
    useLayoutEffect(() => {
      updateMorph();
    }, [width, height, updateMorph]);

    const handleResize = useCallback(() => {
      if (!rootRef.current) return;

      const { width: w, height: h } = rootRef.current.getBoundingClientRect();
      if (w === sizes.width && h === sizes.height) {
        updateMorph();
        return;
      }
      setSize([w, h]);
      sizes.width = w;
      sizes.height = h;
      updateMorph();
    }, [updateMorph]);

    useEffect(() => {
      requestAnimationFrame(handleResize);
      const throttleResize = throttleRAF(handleResize, 200);
      window.addEventListener("resize", throttleResize);

      return () => {
        window.removeEventListener("resize", throttleResize);
      };
    }, [handleResize]);

    const animationStart = useCallback(
      (isOpenAnimation: boolean) => {
        const tl = gsap.timeline({
          onUpdate: updateMorph,
          overwrite: true,
          delay: isOpenAnimation ? delay.in : delay.out,
          onComplete: () => {
            onComplete?.(isOpenAnimation);
          },
        });

        const offset =
          direction !== "right"
            ? (offsets[currentBreakpoint] ?? 0.3)
            : 0.5;

        if (isOpenAnimation) {
          tl.fromTo(
            points,
            {
              center: 0,
            },
            {
              duration,
              center: 1,
              ease: "power3.inOut",
              startAt: {
                center: 0,
              },
              immediateRender: false,
              inherit: false,
            },
          );
          tl.fromTo(
            points,
            {
              start: 0,
            },
            {
              duration,
              start: 1,
              ease: "power3.inOut",
              startAt: {
                start: 0,
              },
              immediateRender: false,
              inherit: false,
            },
            duration / 20,
          );
          tl.fromTo(
            points,
            {
              offset: 0,
            },
            {
              offset,
              duration: duration / 2,
              yoyo: true,
              repeat: 1,
              ease: "power3.in",
              startAt: {
                offset: 0,
              },
              immediateRender: false,
              inherit: false,
            },
            0,
          );
        } else {
          tl.to(points, {
            duration,
            center: 0,
            ease: "power3.inOut",
          });
          tl.to(
            points,
            {
              duration,
              start: 0,
              ease: "power3.inOut",
            },
            duration / 20,
          );
          tl.to(
            points,
            {
              offset: offset * -1,
              duration: duration / 2,
              yoyo: true,
              repeat: 1,
              ease: "power3.in",
            },
            0,
          );
        }

        return () => {
          tl.kill();
        };
      },
      [direction, duration, onComplete, updateMorph, currentBreakpoint],
    );

    useValueUpdate(animationStart, isOpen);

    useEffect(() => {
      if (isOpen) {
        animationStart(isOpen);
      }
      // mount only — same as Love Child
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [setElement] = useResizeObserver({
      callback: handleResize,
    });

    useEffect(() => {
      setElement(rootRef.current);
      // mount only — same as Love Child
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={rootRef}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`}>
          <clipPath id={uniqSvgId}>
            <path ref={refPath} d={closeState} />
          </clipPath>
        </svg>
      </div>
    );
  },
);

BgMorph.displayName = "BgMorph";

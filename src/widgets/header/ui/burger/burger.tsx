"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import s from "./burger.module.scss";

export type BurgerProps = {
  isOpen?: boolean;
  onClick?: () => void;
};

const lineCenter = (line: HTMLElement, root: HTMLElement) => {
  const rootBox = root.getBoundingClientRect();
  const lineBox = line.getBoundingClientRect();

  return lineBox.top - rootBox.top + lineBox.height / 2;
};

const meetOffsets = (top: HTMLElement, bottom: HTMLElement, root: HTMLElement) => {
  const topCenter = lineCenter(top, root);
  const bottomCenter = lineCenter(bottom, root);
  const meet = (topCenter + bottomCenter) / 2;

  return {
    top: meet - topCenter,
    bottom: meet - bottomCenter,
  };
};

export const Burger = ({ isOpen, onClick }: BurgerProps) => {
  const rootRef = useRef<HTMLButtonElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);
  const toggleTl = useRef<gsap.core.Timeline | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const opened = isOpen ?? uncontrolledOpen;
  const wasOpen = useRef(opened);

  const linesOf = () =>
    rootRef.current?.querySelectorAll<HTMLElement>(`.${s.line}`) ?? [];

  const ensureHoverTl = () => {
    if (hoverTl.current) return hoverTl.current;

    const root = rootRef.current;
    if (!root) return null;

    const lines = linesOf();
    const tl = gsap.timeline({ paused: true });

    lines.forEach((line, index) => {
      const delay = index * 0.16;
      const isBottom = index === 1;

      tl.to(
        line,
        {
          xPercent: 100,
          duration: 0.25,
          ease: "power2.in",
        },
        delay,
      )
        .set(
          line,
          {
            xPercent: -100,
            scaleX: isBottom ? 0.55 : 1,
            transformOrigin: "left center",
          },
          delay + 0.25,
        )
        .to(
          line,
          {
            xPercent: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          delay + 0.25,
        );
    });

    hoverTl.current = tl;
    return tl;
  };

  const resetHover = () => {
    hoverTl.current?.pause(0);
    const lines = linesOf();
    if (lines.length) {
      gsap.set(lines, {
        xPercent: 0,
        scaleX: 1,
        transformOrigin: "center center",
      });
    }
  };

  const ensureToggleTl = () => {
    if (toggleTl.current) return toggleTl.current;

    const root = rootRef.current;
    const lines = linesOf();
    const top = lines[0];
    const bottom = lines[1];
    if (!root || !top || !bottom) return null;

    const { top: topY, bottom: bottomY } = meetOffsets(top, bottom, root);

    toggleTl.current = gsap
      .timeline({ paused: true })
      .to(
        top,
        {
          y: topY,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        bottom,
        {
          y: bottomY,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0,
      )
      .to(top, { rotation: 45, duration: 0.28, ease: "power2.inOut" })
      .to(bottom, { rotation: -45, duration: 0.28, ease: "power2.inOut" }, "<");

    return toggleTl.current;
  };

  const hover = () => {
    if (opened) return;
    ensureHoverTl()?.play();
  };

  const leave = () => {
    if (opened) return;
    hoverTl.current?.reverse();
  };

  useEffect(() => {
    if (wasOpen.current === opened) return;
    wasOpen.current = opened;

    if (opened) {
      resetHover();
      ensureToggleTl()?.play();
      return;
    }

    toggleTl.current?.reverse();
  }, [opened]);

  useEffect(() => {
    return () => {
      hoverTl.current?.kill();
      toggleTl.current?.kill();
      hoverTl.current = null;
      toggleTl.current = null;
    };
  }, []);

  return (
    <button
      ref={rootRef}
      className={s.root}
      type="button"
      aria-label={opened ? "Close menu" : "Open menu"}
      aria-expanded={opened}
      onClick={() => {
        if (isOpen === undefined) setUncontrolledOpen((value) => !value);
        onClick?.();
      }}
      onMouseEnter={hover}
      onMouseLeave={leave}
    >
      <span className={s.line} />
      <span className={s.line} />
    </button>
  );
};

Burger.displayName = "Burger";

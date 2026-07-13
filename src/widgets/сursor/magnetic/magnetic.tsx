"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import type { ReactElement } from "react";
import { cloneElement, useEffect, useRef, useState } from "react";

// import { useCursor } from "../cursor";

import { useCursorActions } from "@widgets/сursor/model/cursorStore";
import type { MouseData } from "@widgets/сursor/types";

import styles from "./magnetic.module.scss";

export type MagneticProps = {
  children: ReactElement<HTMLDivElement>;
  className?: string;
};

export const Magnetic = ({ className, children }: MagneticProps) => {
  const $root = useRef<HTMLDivElement>(null);
  const $enter = useRef<boolean>(false);

  const [isEnter, setEnter] = useState<boolean>(false);

  const { addCallback, removeCallback } = useCursorActions();

  const vars = useRef({
    size: {
      w: 0,
      h: 0,
      left: 0,
      top: 0,
    },
  });

  const onEnterEvent = (): void => {
    $enter.current = true;
    setEnter($enter.current);
  };

  const onLeaveEvent = (): void => {
    if ($enter.current) {
      $enter.current = false;
      setEnter($enter.current);

      gsap.to($root.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "sine.inOut",
        overwrite: "auto",
      });
    }
  };

  useEffect(() => {
    if (!$root.current) return;

    const move = (data: MouseData): void => {
      if ($enter.current && $root.current) {
        const { w, h, left, top } = vars.current.size;

        const dx = (data.x - left) / w - 0.5;
        const dy = (data.y - top) / h - 0.5;

        gsap.to($root.current, {
          x: dx * w * 0.4,
          y: dy * h * 0.4,
          ease: "none",
        });
      }
    };

    const resize = (): void => {
      if (!$root.current) return;

      const bounds = $root.current.getBoundingClientRect();

      vars.current.size.w = bounds.width;
      vars.current.size.h = bounds.height;
      vars.current.size.left = bounds.left;
      vars.current.size.top = bounds.top;
    };

    resize();

    addCallback(move);
    window.addEventListener("resize", resize);

    return () => {
      removeCallback(move);
      window.removeEventListener("resize", resize);
    };
  }, []); // eslint-disable-line

  return (
    <div
      ref={$root}
      data-cursor-type="hidden"
      onMouseEnter={onEnterEvent}
      onMouseLeave={onLeaveEvent}
      className={clsx(styles.root, className, {
        [styles.show]: isEnter,
      })}
    >
      {cloneElement(children, {
        className: children.props.className,
      })}
    </div>
  );
};

Magnetic.displayName = "Magnetic";

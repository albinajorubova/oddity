"use client";

import { createContext, useEffect, useRef } from "react";
import {
  useCursorActions,
  useCursorStore,
} from "@widgets/сursor/model/cursorStore";
import type { CursorType, MouseCallback } from "@widgets/сursor/types";
import clsx from "clsx";
import { gsap } from "gsap";
import { useSwitchTransition } from "transition-hook";

import { lerp, mod } from "@shared/utils";

import s from "./cursor.module.scss";

type CursorProps = {
  speed?: number;
};

interface CursorContextValue {
  setType: (type: string) => void;
  setCursorText: (text: string | null) => void;
}

export const CursorContext = createContext<CursorContextValue | null>(null);

CursorContext.displayName = "CursorContext";

export const setTransform = (el: HTMLDivElement, x: number, y: number) => {
  if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

export const CursorBody = ({
  type,
  isVisible,
}: {
  type: CursorType;
  isVisible: boolean;
}) => {
  const $root = useRef(null);

  useEffect(() => {
    gsap.to($root.current, {
      opacity: isVisible ? 1 : 0,
      duration: 0.3,
    });
  }, [isVisible]);

  return (
    <div
      ref={$root}
      style={{
        opacity: 0,
      }}
    >
      {type}
    </div>
  );
};

export const Cursor = (props: CursorProps) => {
  const { speed = 0.2 } = props;

  const $root = useRef<HTMLDivElement>(null);

  const $sizes = useRef({
    width: 0,
    height: 0,
  });

  const cursorType = useCursorStore((store) => store.cursorType);
  const callbacks = useCursorStore((store) => store.callbacks);
  const { setCursorType } = useCursorActions();

  const mods = mod(s, { type: cursorType });

  const $callbacks = useRef<MouseCallback[]>([]);

  useEffect(() => {
    $callbacks.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    if (!$root.current) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y, target: null };

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.x;
      mouse.y = e.y;
    }

    const render = () => {
      const dt = 1.0 - (1.0 - speed) ** gsap.ticker.deltaRatio();

      pos.x = lerp(pos.x, mouse.x, dt);
      pos.y = lerp(pos.y, mouse.y, dt);

      const halfWidth = $sizes.current.width / 2;
      const halfHeight = $sizes.current.height / 2;

      if ($root.current) {
        setTransform($root.current, pos.x - halfWidth, pos.y - halfHeight);
      }

      $callbacks.current.forEach((cb) => {
        const data = { x: pos.x, y: pos.y, target: mouse.target };

        cb(data);
      });
    };

    const resize = () => {
      if ($root.current) {
        $sizes.current.width = $root.current.clientWidth;
        $sizes.current.height = $root.current.clientHeight;
      }
    };

    const handleMouseDown = () => {
      if ($root.current) $root.current.style.setProperty("--md", "1");
    };

    const handleMouseUp = () => {
      if ($root.current) $root.current.style.setProperty("--md", "0");
    };

    const onMouseWindowLeave = () => {
      setCursorType("default");
    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.document.addEventListener("mouseleave", onMouseWindowLeave);

    gsap.ticker.add(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.document.removeEventListener("mouseleave", onMouseWindowLeave);

      gsap.ticker.remove(render);
    };
  }, [speed]);

  const transition = useSwitchTransition(cursorType, 300, "default");

  return (
    <div ref={$root} className={clsx(s.root, mods)}>
      <div className={s.inner}>
        {transition((state, stage) => (
          <CursorBody type={state} isVisible={stage === "enter"} />
        ))}
      </div>
    </div>
  );
};

Cursor.displayName = "Cursor";

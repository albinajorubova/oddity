import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import useVariables from "@/shared/hooks/use-variables";

interface TouchPosition {
  x: number;
  y: number;
}

interface TouchHandlers {
  onDown?: (data: TouchEventData) => void;
  onUp?: (data: TouchEventData) => void;
  onMove?: (data: TouchEventData) => void;
}

export type EventType = Event;

export interface TouchEventData {
  isTouching: boolean;
  lastTouch: TouchPosition;
  touchMomentum: TouchPosition;
  delta: TouchPosition;
  type?: "touch";
  event: EventType;
}

const useTouch = (
  handlers: TouchHandlers = {},
  touchSwipeMultiplier: number = 2.4,
  mouseSwipeMultiplier: number = 1.8,
  momentumCarry: number = 0.2,
): [RefObject<HTMLElement | null>] => {
  const touchRef = useRef<HTMLDivElement | null>(null);

  const vars = useVariables({
    isTouching: false,
    lastTouch: {
      x: 0,
      y: 0,
    },
    touchMomentum: {
      x: 0,
      y: 0,
    },
    delta: {
      x: 0,
      y: 0,
    },
  });

  const onTouchDown = (event: EventType) => {
    const isTouch = "touches" in event;

    vars.isTouching = true;

    vars.lastTouch.x = isTouch
      ? (event as TouchEvent).touches[0].clientX
      : (event as MouseEvent).clientX;
    vars.lastTouch.y = isTouch
      ? (event as TouchEvent).touches[0].clientY
      : (event as MouseEvent).clientY;

    if (handlers.onDown) handlers.onDown({ ...vars, event });
  };

  const onTouchUp = (event: EventType) => {
    vars.isTouching = false;

    if (handlers.onUp) handlers.onUp({ ...vars, event });
  };

  const onTouchMove = (event: EventType) => {
    if (!vars.isTouching) {
      return;
    }

    const isTouch = "touches" in event;

    const touchX = isTouch
      ? (event as TouchEvent).touches[0].clientX
      : (event as MouseEvent).clientX;
    const touchY = isTouch
      ? (event as TouchEvent).touches[0].clientY
      : (event as MouseEvent).clientY;

    const deltaX =
      (touchX - vars.lastTouch.x) *
      (isTouch ? touchSwipeMultiplier : mouseSwipeMultiplier);
    const deltaY =
      (touchY - vars.lastTouch.y) *
      (isTouch ? touchSwipeMultiplier : mouseSwipeMultiplier);

    vars.lastTouch.x = touchX;
    vars.lastTouch.y = touchY;

    vars.touchMomentum.x *= momentumCarry;
    vars.touchMomentum.y *= momentumCarry;

    vars.touchMomentum.y += deltaY;
    vars.touchMomentum.x += deltaX;

    vars.delta.x = deltaX;
    vars.delta.y = deltaY;

    if (handlers.onMove) handlers.onMove({ ...vars, type: "touch", event });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const element = touchRef.current ? touchRef.current : window;

    if (!element) return;

    const onUp = (e: EventType) => {
      element.removeEventListener("mousemove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onUp);

      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onUp);

      onTouchUp(e);
    };

    const onDown = (e: EventType) => {
      element.addEventListener("mousemove", onTouchMove);
      window.addEventListener("mouseup", onUp);
      document.documentElement.addEventListener("mouseleave", onUp);

      element.addEventListener("touchmove", onTouchMove, {
        passive: true,
      });
      element.addEventListener("touchend", onUp, {
        passive: true,
      });

      onTouchDown(e);
    };

    element.addEventListener("mousedown", onDown);
    element.addEventListener("touchstart", onDown, {
      passive: true,
    });

    return () => {
      element.removeEventListener("mousedown", onDown);
      element.removeEventListener("touchstart", onDown);
      element.removeEventListener("mousemove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onUp);

      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onUp);
    };
  }, []);

  return [touchRef];
};

export default useTouch;

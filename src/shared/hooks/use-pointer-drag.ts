import { type RefObject, useEffect, useRef } from "react";

export type UsePointerDragProps = {
  onStart?: () => void;
  onMove?: (offsetX: number, offsetY: number) => void;
  onEnd?: () => void;
};

export const usePointerDrag = ({
  onStart,
  onMove,
  onEnd,
}: UsePointerDragProps): RefObject<HTMLDivElement | null> => {
  const $touchRef = useRef<HTMLDivElement | null>(null);

  const vars = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    pointerId: -1,
  });

  useEffect(() => {
    if (!$touchRef.current) return;

    const touchElement = $touchRef.current;

    const onPointerMove = (e: PointerEvent) => {
      if (!vars.current.isDragging || e.pointerId !== vars.current.pointerId) {
        return;
      }

      const deltaX = e.clientX - vars.current.startX;
      const deltaY = e.clientY - vars.current.startY;

      vars.current.offsetX = deltaX;
      vars.current.offsetY = deltaY;

      onMove?.(vars.current.offsetX, vars.current.offsetY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== vars.current.pointerId) {
        return;
      }

      const pointerId = vars.current.pointerId;

      vars.current.isDragging = false;
      vars.current.pointerId = -1;

      if (touchElement && pointerId !== -1) {
        touchElement.releasePointerCapture(pointerId);
      }

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);

      onEnd?.();
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      vars.current.isDragging = true;
      vars.current.startX = e.clientX;
      vars.current.startY = e.clientY;
      vars.current.offsetX = 0;
      vars.current.offsetY = 0;
      vars.current.pointerId = e.pointerId;

      touchElement.setPointerCapture(e.pointerId);

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      document.addEventListener("pointerleave", onPointerUp);
      document.addEventListener("pointercancel", onPointerUp);

      onStart?.();
    };

    touchElement.addEventListener("pointerdown", onPointerDown);

    return () => {
      touchElement.removeEventListener("pointerdown", onPointerDown);

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);

      if (vars.current.pointerId !== -1 && touchElement) {
        touchElement.releasePointerCapture(vars.current.pointerId);
      }
    };
  }, []);

  return $touchRef;
};

import { useCallback, useRef } from "react";

import { usePointerDrag } from "@shared/hooks/use-pointer-drag";

export type DragMoveData = {
  offsetX: number;
  offsetY: number;
  velocity: number; // скорость в пикселях в секунду
  angle: number; // направление угла в радианах
};

export type DragEndData = {
  velocity: number; // финальная скорость для инерции
  angle: number; // направление угла в радианах
  offsetX: number;
  offsetY: number;
};

export type UseDragProps = {
  onStart?: () => void;
  onMove?: (data: DragMoveData) => void;
  onEnd?: (data: DragEndData) => void;
};

export type DragHistoryItem = {
  x: number;
  y: number;
  time: number;
};

const calculateVelocity = (
  x1: number,
  y1: number,
  time1: number,
  x2: number,
  y2: number,
  time2: number,
): { velocity: number; angle: number } => {
  const deltaTime = time2 - time1;
  if (deltaTime <= 0) {
    return { velocity: 0, angle: 0 };
  }

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const velocity = (distance / deltaTime) * 1000; // пиксели в секунду

  // Направление угла в радианах (0 = вправо, π/2 = вниз, π = влево, -π/2 = вверх)
  const angle = Math.atan2(deltaY, deltaX);

  return { velocity, angle };
};

export const useDrag = ({ onStart, onMove, onEnd }: UseDragProps) => {
  const historyRef = useRef<Array<DragHistoryItem>>([]);
  const lastPositionRef = useRef<DragHistoryItem | null>(null);

  const handleStart = useCallback(() => {
    historyRef.current = [];
    lastPositionRef.current = null;
    onStart?.();
  }, [onStart]);

  const handleMove = useCallback(
    (offsetX: number, offsetY: number) => {
      const now = performance.now();
      const currentPosition = { x: offsetX, y: offsetY, time: now };

      historyRef.current.push(currentPosition);
      if (historyRef.current.length > 10) {
        historyRef.current.shift();
      }

      let velocity = 0;
      let angle = 0;

      if (lastPositionRef.current) {
        const { velocity: v, angle: a } = calculateVelocity(
          lastPositionRef.current.x,
          lastPositionRef.current.y,
          lastPositionRef.current.time,
          offsetX,
          offsetY,
          now,
        );
        velocity = v;
        angle = a;
      }

      lastPositionRef.current = currentPosition;

      onMove?.({
        offsetX,
        offsetY,
        velocity,
        angle,
      });
    },
    [onMove],
  );

  const handleEnd = useCallback(() => {
    const history = historyRef.current;
    let finalVelocity = 0;
    let finalAngle = 0;
    let finalOffsetX = 0;
    let finalOffsetY = 0;

    if (history.length >= 2) {
      const recentPoints = history.slice(-5);
      const firstPoint = recentPoints[0];
      const lastPoint = recentPoints[recentPoints.length - 1];

      const { velocity, angle } = calculateVelocity(
        firstPoint.x,
        firstPoint.y,
        firstPoint.time,
        lastPoint.x,
        lastPoint.y,
        lastPoint.time,
      );

      finalVelocity = velocity;
      finalAngle = angle;
      finalOffsetX = lastPoint.x;
      finalOffsetY = lastPoint.y;
    } else if (lastPositionRef.current) {
      finalOffsetX = lastPositionRef.current.x;
      finalOffsetY = lastPositionRef.current.y;
    }

    historyRef.current = [];
    lastPositionRef.current = null;

    onEnd?.({
      velocity: finalVelocity,
      angle: finalAngle,
      offsetX: finalOffsetX,
      offsetY: finalOffsetY,
    });
  }, [onEnd]);

  const $rootRef = usePointerDrag({
    onStart: handleStart,
    onMove: handleMove,
    onEnd: handleEnd,
  });

  return $rootRef;
};

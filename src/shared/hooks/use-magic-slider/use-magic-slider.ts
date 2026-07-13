import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import {
  type DragEndData,
  type DragMoveData,
  useDrag,
} from "@shared/hooks/use-drag";
import { getInfinityPosition } from "@shared/utils";
import { composeRefs } from "@shared/utils/compose-refs";
import { getBoundElement } from "@shared/utils/get-bound-element";
import { setStyle } from "@shared/utils/set-style";

import { computeRemainingAndTime, findMinDistanceByValues } from "./utils";

export type UseMagicSliderProps = {
  initialSlide?: number;
  minSwipeVelocity?: number;
  snapDuration?: number;
  snapEase?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

export type UseMagicSliderReturn = [
  (node: HTMLDivElement) => void,
  number,
  UseMagicSliderActions,
];

export type UseMagicSliderActions = {
  slideToSlide: (index: number) => void;
};

const defaultProps = {
  initialSlide: 0,
  minSwipeVelocity: 1000,
  snapDuration: 0.5,
  snapEase: "power2.out",
  autoPlay: false,
  autoPlayInterval: 1000,
};

export const useMagicSlider = (
  options?: UseMagicSliderProps,
): UseMagicSliderReturn => {
  const {
    initialSlide,
    minSwipeVelocity,
    snapDuration,
    snapEase,
    autoPlay,
    autoPlayInterval,
  } = {
    ...defaultProps,
    ...options,
  };

  const [activeIndex, setActiveIndex] = useState<number>(initialSlide);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const $root = useRef<HTMLDivElement>(null);

  const vars = useMemo(
    () => ({
      isDragging: false,
      position: 0,
      activeIndex: 0,
      children: [] as Element[],
      bound: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    }),
    [],
  );

  vars.activeIndex = activeIndex;
  vars.isDragging = isDragging;

  const devData = useMemo(
    () => ({
      startDragPosition: 0,
      animationTween: null as gsap.core.Tween | null,
    }),
    [],
  );

  const childrenUpdate = useCallback(() => {
    setActiveIndex(
      parseInt(
        getInfinityPosition(
          Math.round(vars.position) * -1,
          vars.children.length,
          0,
        ).toString(),
        10,
      ),
    );

    vars.children.forEach((child, i) => {
      const initialPosition = i + vars.position;

      const curPosition = getInfinityPosition(
        initialPosition,
        vars.children.length,
        1,
      );

      setStyle(
        child as HTMLElement,
        "--position-progress",
        `${curPosition - i}`,
      );
      setStyle(child as HTMLElement, "--position-real", `${curPosition}`);
      setStyle(child as HTMLElement, "--position-initial", `${i}`);
    });
  }, []);

  const handleDragStart = useCallback(() => {
    devData.startDragPosition = vars.position;
    setIsDragging(true);

    if (devData.animationTween) {
      devData.animationTween.kill();
      devData.animationTween = null;
    }
  }, []);

  const handleDragMove = useCallback((data: DragMoveData) => {
    vars.position = devData.startDragPosition + data.offsetX / vars.bound.width;
    childrenUpdate();
  }, []);

  const handleDragEnd = useCallback(({ velocity, offsetX }: DragEndData) => {
    const { children, bound, position } = vars;
    setIsDragging(false);

    if (children.length === 0 || bound.width === 0) return;

    const direction = Math.sign(offsetX);
    const absDistance = Math.abs(offsetX) / bound.width;
    const velocitySigned = velocity * direction;
    const isMinSwipeVelocity = Math.abs(velocity) < minSwipeVelocity; // Если скорость меньше минимальной — snap на ближайший слайд

    const { sRemain, tRemain } = computeRemainingAndTime(
      velocitySigned,
      1000,
      offsetX,
    );

    const remainingPercentage = sRemain / bound.width;
    const remainingPosition = position + remainingPercentage;
    const duration = isMinSwipeVelocity ? snapDuration : tRemain;

    let finalPosition = isMinSwipeVelocity
      ? absDistance > 0.5
        ? position + 1 * direction
        : position
      : remainingPosition;
    finalPosition = Math.round(finalPosition);

    devData.animationTween = gsap.to(vars, {
      position: finalPosition,
      duration,
      ease: snapEase ?? "power2.out",
      onUpdate: childrenUpdate,
      onComplete: () => {
        devData.animationTween = null;
      },
    });
  }, []);

  useEffect(() => {
    if (!$root.current) return;

    const onResize = () => {
      vars.children = [...($root.current?.children || [])];
      vars.bound = getBoundElement($root);
    };

    onResize();

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe($root.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // set initial slide position
  useEffect(() => {
    if (initialSlide !== 0) {
      vars.position = initialSlide;
      childrenUpdate();
    }
  }, [initialSlide]);

  const $touchRef = useDrag({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onEnd: handleDragEnd,
  });

  const sliderActions = useMemo(
    () => ({
      slideToSlide: (index: number) => {
        const { position, children, activeIndex: currentActiveIndex } = vars;

        const array = new Array(children.length * 3)
          .fill(0)
          .map((_, i) => i % children.length);

        const dist = findMinDistanceByValues(array, currentActiveIndex, index);

        devData.animationTween = gsap.to(vars, {
          position: Math.round(position + dist),
          duration: snapDuration,
          ease: snapEase ?? "power2.out",
          onUpdate: childrenUpdate,
          onComplete: () => {
            devData.animationTween = null;
          },
        });
      },
    }),
    [],
  );

  useEffect(() => {
    if (autoPlay && !isDragging) {
      const timeout = setTimeout(() => {
        sliderActions.slideToSlide(activeIndex + 1);
      }, autoPlayInterval);

      return () => clearTimeout(timeout);
    }
  }, [activeIndex, autoPlay, isDragging]);

  return [
    composeRefs($root, $touchRef) as (node: HTMLDivElement) => void,
    activeIndex,
    sliderActions,
  ];
};

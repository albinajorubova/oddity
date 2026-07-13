"use client";

import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";
import clsx from "clsx";
import gsap from "gsap";
import { type ComponentProps, useEffect, useRef } from "react";

import CanvasRender from "./CanvasSequence";

import s from "./sequence.module.scss";

export type SequenceProps = ComponentProps<"div"> & {
  className?: string;
  frames: string[];
  progress: {
    current: number;
  };
};

export const Sequence = (props: SequenceProps) => {
  const { className, frames, progress } = props;
  const $instance = useRef<CanvasRender>(null);
  const $canvas = useRef<HTMLCanvasElement>(null);

  const [ref, inView] = useIntersectionObserver<HTMLDivElement>({
    triggerOnce: false,
  });

  useEffect(() => {
    if (!$canvas.current) return;

    $instance.current = new CanvasRender({
      images: frames,
      canvas: $canvas.current,
      defaultIndex: 0,
    });

    $instance.current.init();

    return () => {
      if ($instance.current) $instance.current.destroy();
    };
  }, []);

  const updateProgress = () => {
    $instance.current?.onChangeProgress(progress.current);
  };

  useEffect(() => {
    if (inView) {
      gsap.ticker.add(updateProgress);

      return () => {
        gsap.ticker.remove(updateProgress);
      };
    }
  }, [inView]);

  return (
    <div ref={ref} className={clsx(s.root, className)}>
      <canvas className={s.canvas} ref={$canvas} />
    </div>
  );
};

Sequence.displayName = "Sequence";

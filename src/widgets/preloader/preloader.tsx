"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { usePreloader } from "@widgets/preloader/hooks/use-preloader";
import {
  usePreloaderActions,
  usePreloaderStore,
} from "@widgets/preloader/model/preloaderStore";
import clsx from "clsx";
import gsap from "gsap";

import s from "./preloader.module.scss";

export type PreloaderProps = ComponentProps<"div"> & {
  className?: string;
  additionalResources?: string[];
};

export const Preloader = (props: PreloaderProps) => {
  const { className, additionalResources } = props;

  const $root = useRef<HTMLDivElement>(null);
  const { isFinishSequenceAnimation, isFinishEndAnimation, formattedPercents } =
    usePreloaderStore();
  const { setFinishEndAnimation, setStartEndAnimation } = usePreloaderActions();

  /* TODO: Подумать как лучше прокидывать, дополнительные файлы глобально из приложения */

  // useEffect(() => {
  //   if (additionalResources) setAdditionalData(additionalResources);
  // }, [additionalResources]);

  usePreloader(10, additionalResources || []);

  useEffect(() => {
    gsap.to($root.current, {
      "--preloader-progress": 1,
      duration: 3,
      ease: "power2.inOut",
      onComplete: () => {
        setStartEndAnimation();
        gsap.to($root.current, {
          "--close-progress": 1,
          ease: "power4.out",
          onComplete: () => {
            setFinishEndAnimation(true);
          },
        });
      },
    });
  }, []);

  console.log(isFinishEndAnimation);

  if (isFinishEndAnimation) return;

  return (
    <div ref={$root} className={clsx(s.root, className)}>
      <div className={s.inner}>
        <div className={s.icon}>
          <div className={s.inner}>{formattedPercents}</div>
        </div>
      </div>
    </div>
  );
};

Preloader.displayName = "Preloader";

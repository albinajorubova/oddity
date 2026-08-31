"use client";

import { type ComponentProps, useEffect } from "react";
import clsx from "clsx";

import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";

import s from "./video.module.scss";

export type VideoProps = ComponentProps<"video"> & {};

export const Video = (props: VideoProps) => {
  const { ref, className, loop = true, autoPlay, ...restProps } = props;

  return (
    <video
      ref={ref}
      autoPlay={autoPlay}
      className={clsx(s.root, className)}
      loop={loop}
      playsInline
      preload="metadata"
      {...restProps}
    />
  );
};

Video.displayName = "Video";

export const InViewVideo = (props: VideoProps) => {
  const { className, ...restProps } = props;

  const [ref, inView] = useIntersectionObserver<HTMLVideoElement>({
    triggerOnce: false,
  });

  useEffect(() => {
    if (ref.current) {
      if (inView) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [inView]);

  return (
    <Video ref={ref} autoPlay={false} className={className} {...restProps} />
  );
};

InViewVideo.displayName = "InViewVideo";

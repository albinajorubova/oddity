"use client";

import type { ComponentProps } from "react";
import { useEffect } from "react";
import { gsap } from "gsap";

import { Modules } from "./modules";

export type GsapProps = ComponentProps<"div"> & {};

export const Gsap = () => {
  useEffect(() => {
    gsap.defaults({ ease: "none", duration: 1 });

    gsap.config({
      autoSleep: 60,
      nullTargetWarn: false,
    });

    gsap.ticker.lagSmoothing(0);
  }, []);

  return <Modules />;
};

Gsap.displayName = "Gsap";

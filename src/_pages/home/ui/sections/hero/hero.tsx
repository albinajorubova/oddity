"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { OddLogo } from "@shared/ui/odd-logo";
import { HOME_HERO_STUB } from "@/_pages/home/model";

import { OrbitGallery } from "./ui/orbit-gallery";

import s from "./hero.module.scss";

gsap.registerPlugin(ScrollTrigger);

const MORPH_END = 0.6;

const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const centerOf = (el: HTMLElement) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
};

const fontSizeOf = (el: HTMLElement) =>
  Number.parseFloat(getComputedStyle(el).fontSize) || 0;

export const HeroSection = () => {
  const content = HOME_HERO_STUB;
  const brandRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isMorphing, setIsMorphing] = useState(false);

  useEffect(() => {
    const logo = brandRef.current;
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const headerLogo =
      document.querySelector<HTMLElement>("[data-header-logo]");
    const headerInner = headerLogo?.firstElementChild as HTMLElement | null;

    if (!logo || !section || !gallery || !headerLogo || !headerInner) return;

    const images = gallery.querySelectorAll<HTMLElement>("figure");
    const imageMetrics = new Map<HTMLElement, { x: number; y: number }>();
    const metrics = {
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      scale: 1,
    };

    let refreshing = false;
    let morphing = false;

    const setMorphing = (next: boolean) => {
      if (morphing === next) return;
      morphing = next;
      setIsMorphing(next);
    };

    const capture = () => {
      const from = centerOf(logo);
      const to = centerOf(headerInner);
      metrics.fromX = from.x;
      metrics.fromY = from.y;
      metrics.toX = to.x;
      metrics.toY = to.y;
      metrics.scale = fontSizeOf(headerInner) / fontSizeOf(logo) || 1;

      imageMetrics.clear();
      images.forEach((image) => {
        const c = centerOf(image);
        const dx = c.x - from.x;
        const dy = c.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        imageMetrics.set(image, { x: dx / len, y: dy / len });
      });
    };

    const rest = () => {
      logo.classList.remove(s.isFlying);
      gsap.set(logo, {
        clearProps:
          "x,y,xPercent,yPercent,scale,transform,opacity,visibility,pointerEvents",
      });
      images.forEach((image) => {
        gsap.set(image, { clearProps: "transform,opacity,visibility" });
      });
      gsap.set(headerLogo, { autoAlpha: 0, pointerEvents: "none" });
    };

    const updateGallery = (t: number) => {
      imageMetrics.forEach((dir, image) => {
        gsap.set(image, {
          x: dir.x * window.innerWidth * 0.6 * t,
          y: dir.y * window.innerHeight * 0.6 * t,
          scale: 1 + 0.15 * t,
          autoAlpha: 1 - t,
        });
      });
    };

    const render = (progress: number) => {
      if (progress <= 0) {
        rest();
        setMorphing(false);
        return;
      }

      if (!logo.classList.contains(s.isFlying)) capture();

      const morph = Math.min(progress / MORPH_END, 1);
      const fade =
        progress <= MORPH_END
          ? 0
          : (progress - MORPH_END) / (1 - MORPH_END);

      logo.classList.add(s.isFlying);
      gsap.set(logo, {
        xPercent: -50,
        yPercent: -50,
        x: mix(metrics.fromX, metrics.toX, morph),
        y: mix(metrics.fromY, metrics.toY, morph),
        scale: mix(1, metrics.scale, morph),
        autoAlpha: 1 - fade,
        pointerEvents: "none",
        force3D: true,
      });
      gsap.set(headerLogo, {
        autoAlpha: fade,
        pointerEvents: fade > 0.5 ? "auto" : "none",
      });
      updateGallery(morph);
      setMorphing(progress < 1);
    };

    capture();
    gsap.set(headerLogo, { autoAlpha: 0, pointerEvents: "none" });

    const trigger = ScrollTrigger.create({
      trigger: section,
      scroller: "#scroll",
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onRefreshInit: () => {
        refreshing = true;
      },
      onRefresh: (self) => {
        rest();
        capture();
        refreshing = false;
        render(self.progress);
      },
      onUpdate: (self) => {
        if (refreshing) return;
        render(self.progress);
      },
    });

    return () => {
      trigger.kill();
      rest();
      gsap.set(headerLogo, { clearProps: "opacity,visibility,pointerEvents" });
    };
  }, []);

  return (
    <section className={s.root} ref={sectionRef}>
      <div className={s.content}>
        <OrbitGallery ref={galleryRef} />
        <h1 className={s.brand} aria-label={content.brand} ref={brandRef}>
          <OddLogo text={content.brand} disabled={isMorphing} />
        </h1>
      </div>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

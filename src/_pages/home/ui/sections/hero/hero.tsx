"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { OddLogo } from "@shared/ui/odd-logo";
import { HOME_EXPAND_STUB, HOME_HERO_STUB } from "@/_pages/home/model";

import { OrbitGallery } from "./ui/orbit-gallery";

import s from "./hero.module.scss";

gsap.registerPlugin(ScrollTrigger);

const MORPH_END = 0.45;
const EXPAND_END = 0.78;

const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const centerOf = (el: HTMLElement) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
};

const fontSizeOf = (el: HTMLElement) =>
  Number.parseFloat(getComputedStyle(el).fontSize) || 0;

type ExpandMetrics = {
  dx: number;
  dy: number;
  scale: number;
};

export const HeroSection = () => {
  const hero = HOME_HERO_STUB;
  const bridge = HOME_EXPAND_STUB;
  const brandRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [isMorphing, setIsMorphing] = useState(false);

  useEffect(() => {
    const logo = brandRef.current;
    const section = sectionRef.current;
    const content = contentRef.current;
    const gallery = galleryRef.current;
    const copy = copyRef.current;
    const headerLogo =
      document.querySelector<HTMLElement>("[data-header-logo]");
    const headerInner = headerLogo?.firstElementChild as HTMLElement | null;

    if (
      !logo ||
      !section ||
      !content ||
      !gallery ||
      !copy ||
      !headerLogo ||
      !headerInner
    ) {
      return;
    }

    const expandImage = gallery.querySelector<HTMLElement>(
      "[data-orbit-expand]",
    );
    const images = [...gallery.querySelectorAll<HTMLElement>("figure")].filter(
      (image) => image !== expandImage,
    );

    const flyMetrics = new Map<HTMLElement, { x: number; y: number }>();
    const logoMetrics = {
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      scale: 1,
    };
    let expandMetrics: ExpandMetrics = { dx: 0, dy: 0, scale: 1 };

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
      logoMetrics.fromX = from.x;
      logoMetrics.fromY = from.y;
      logoMetrics.toX = to.x;
      logoMetrics.toY = to.y;
      logoMetrics.scale = fontSizeOf(headerInner) / fontSizeOf(logo) || 1;

      flyMetrics.clear();
      images.forEach((image) => {
        const c = centerOf(image);
        const dx = c.x - from.x;
        const dy = c.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        flyMetrics.set(image, { x: dx / len, y: dy / len });
      });

      if (expandImage) {
        const contentBox = content.getBoundingClientRect();
        const imgBox = expandImage.getBoundingClientRect();
        const startCy = imgBox.top + imgBox.height / 2;
        const endCy = contentBox.top + contentBox.height / 2;
        expandMetrics = {
          dx: 0,
          dy: endCy - startCy,
          scale: Math.max(
            contentBox.width / Math.max(imgBox.width, 1),
            contentBox.height / Math.max(imgBox.height, 1),
          ),
        };
      }
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
      if (expandImage) {
        expandImage.classList.remove(s.isExpanding);
        gsap.set(expandImage, {
          clearProps: "transform,opacity,visibility,zIndex,borderRadius",
        });
      }
      gsap.set(copy, { autoAlpha: 0, y: 28 });
      gsap.set(headerLogo, { autoAlpha: 0, pointerEvents: "none" });
    };

    const updateFlyImages = (t: number) => {
      flyMetrics.forEach((dir, image) => {
        gsap.set(image, {
          x: dir.x * window.innerWidth * 0.6 * t,
          y: dir.y * window.innerHeight * 0.6 * t,
          scale: 1 + 0.15 * t,
          autoAlpha: 1 - t,
        });
      });
    };

    const updateExpandImage = (t: number) => {
      if (!expandImage) return;
      const eased = 1 - (1 - t) ** 1.45;
      expandImage.classList.toggle(s.isExpanding, t > 0.02);
      gsap.set(expandImage, {
        x: 0,
        y: expandMetrics.dy * eased,
        scale: mix(1, expandMetrics.scale, eased),
        borderRadius: mix(12, 0, eased),
        zIndex: 5,
        autoAlpha: 1,
        force3D: true,
      });
    };

    const render = (progress: number) => {
      if (progress <= 0) {
        rest();
        setMorphing(false);
        return;
      }

      if (!logo.classList.contains(s.isFlying)) capture();

      const morph = clamp01(progress / MORPH_END);
      const expand = clamp01(progress / EXPAND_END);
      const settled = morph >= 1;
      const copyT =
        expand >= 1 ? clamp01((progress - EXPAND_END) / (1 - EXPAND_END)) : 0;

      logo.classList.add(s.isFlying);
      gsap.set(logo, {
        xPercent: -50,
        yPercent: -50,
        x: mix(logoMetrics.fromX, logoMetrics.toX, morph),
        y: mix(logoMetrics.fromY, logoMetrics.toY, morph),
        scale: mix(1, logoMetrics.scale, morph),
        autoAlpha: settled ? 0 : 1,
        pointerEvents: "none",
        force3D: true,
      });
      gsap.set(headerLogo, {
        autoAlpha: settled ? 1 : 0,
        pointerEvents: settled ? "auto" : "none",
      });
      updateFlyImages(morph);
      updateExpandImage(expand);
      gsap.set(copy, {
        autoAlpha: copyT,
        y: (1 - copyT) * 28,
      });
      setMorphing(!settled);
    };

    capture();
    gsap.set(headerLogo, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(copy, { autoAlpha: 0, y: 28 });

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
      <div className={s.content} ref={contentRef}>
        <OrbitGallery ref={galleryRef} />
        <h1
          className={clsx("typo-display", s.brand)}
          aria-label={hero.brand}
          ref={brandRef}
        >
          <OddLogo text={hero.brand} disabled={isMorphing} />
        </h1>

        <div className={s.copy} ref={copyRef}>
          <p className={clsx(s.eyebrow, "typo-micro")}>{bridge.eyebrow}</p>
          <h2 className={clsx(s.title, "typo-h1")}>{bridge.title}</h2>
          <p className={clsx(s.text, "typo-p1")}>{bridge.text}</p>
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

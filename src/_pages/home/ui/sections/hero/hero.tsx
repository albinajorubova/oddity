"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import type { OddLogoHandle } from "@shared/ui/odd-logo";
import { OddLogo } from "@shared/ui/odd-logo";
import type { HomeOrbitItem } from "@/_pages/home/model";
import { HOME_EXPAND_STUB, HOME_HERO_STUB } from "@/_pages/home/model";

import { createHeroAnimation } from "./hero-animation";
import { OrbitGallery } from "./ui/orbit-gallery";

import s from "./hero.module.scss";

gsap.registerPlugin(ScrollTrigger);

export type HeroSectionProps = {
  orbitItems?: HomeOrbitItem[];
};

export const HeroSection = ({ orbitItems = [] }: HeroSectionProps) => {
  const hero = HOME_HERO_STUB;
  const bridge = HOME_EXPAND_STUB;

  const brandRef = useRef<HTMLHeadingElement>(null);
  const oddLogoRef = useRef<OddLogoHandle>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

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
    const flyImages = [
      ...gallery.querySelectorAll<HTMLElement>("figure"),
    ].filter((image) => image !== expandImage);

    const animation = createHeroAnimation({
      section,
      logo,
      content,
      copy,
      headerLogo,
      headerInner,
      expandImage,
      flyImages,
      classes: {
        isFlying: s.isFlying,
        isExpanding: s.isExpanding,
        isExpanded: s.isExpanded,
        isCopyVisible: s.isCopyVisible,
      },
      setLogoDisabled: (disabled) => {
        oddLogoRef.current?.setDisabled(disabled);
      },
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <section className={s.root} ref={sectionRef}>
      <div className={s.content} ref={contentRef}>
        <OrbitGallery ref={galleryRef} items={orbitItems} />
        <h1
          className={clsx("typo-display", s.brand)}
          aria-label={hero.brand}
          ref={brandRef}
        >
          <OddLogo ref={oddLogoRef} text={hero.brand} introDelayMs={0} />
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

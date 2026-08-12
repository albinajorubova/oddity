"use client";

import clsx from "clsx";

import { ROUTES } from "@shared/config";
import { Button } from "@shared/ui/button";
import { OddLogo } from "@shared/ui/odd-logo";
import { RollingText } from "@shared/ui/rolling-text";
import { HOME_HERO_STUB } from "@/_pages/home/model";

import s from "./hero.module.scss";

export type HeroSectionProps = {
  className?: string;
};

export const HeroSection = (props: HeroSectionProps) => {
  const { className } = props;
  const content = HOME_HERO_STUB;

  return (
    <section className={clsx(s.root, className)}>
      <h1 className={s.brand} aria-label={content.brand}>
        <OddLogo text={content.brand} />
      </h1>

      <Button
        href={ROUTES.collections}
        className={s.cta}
        aria-label={content.ctaLabel}
      >
        <RollingText text={content.ctaLabel} className={s.ctaLabel} />
      </Button>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

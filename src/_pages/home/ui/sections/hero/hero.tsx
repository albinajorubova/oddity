import clsx from "clsx";

import { Button } from "@shared/ui/button";
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
      <h1 className={s.brand}>{content.brand}</h1>

      <div className={s.copy}>
        <p className={s.est}>{content.est}</p>
        <p className={s.description}>{content.description}</p>
      </div>

      <Button href="#gallery" className={s.cta} aria-label={content.ctaLabel}>
        <span className={s.ctaLabel}>{content.ctaLabel}</span>
      </Button>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

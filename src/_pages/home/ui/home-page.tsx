import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { RollingText } from "@/shared/ui/rolling-text";

import { HOME_HERO_STUB } from "../model";
import { HeroSection } from "./sections";

import s from "./home-page.module.scss";

export const HomePage = () => {
  const content = HOME_HERO_STUB;

  return (
    <div className={s.root}>
      <HeroSection />
      <Button
        href={ROUTES.collections}
        className={s.cta}
        aria-label={content.ctaLabel}
      >
        <RollingText text={content.ctaLabel} className={s.ctaLabel} />
      </Button>
    </div>
  );
};

HomePage.displayName = "HomePage";

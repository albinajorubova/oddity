import clsx from "clsx";

import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { RollingText } from "@/shared/ui/rolling-text";

import { HOME_HERO_STUB, type HomeOrbitItem } from "../model";
import { HeroSection } from "./sections";

import s from "./home-page.module.scss";

export type HomePageProps = {
  orbitItems: HomeOrbitItem[];
};

export const HomePage = ({ orbitItems }: HomePageProps) => {
  const content = HOME_HERO_STUB;

  return (
    <div className={s.root}>
      <HeroSection orbitItems={orbitItems} />
      <Button
        href={ROUTES.collections}
        className={s.cta}
        aria-label={content.ctaLabel}
      >
        <RollingText
          text={content.ctaLabel}
          className={clsx(s.ctaLabel, "typo-caption")}
        />
      </Button>
    </div>
  );
};

HomePage.displayName = "HomePage";

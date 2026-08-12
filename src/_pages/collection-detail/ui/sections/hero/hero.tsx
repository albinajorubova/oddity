import clsx from "clsx";

import { Container } from "@shared/ui/container";
import type { CollectionDetail } from "@/_pages/collection-detail/model";

import { HeroCover } from "./ui/hero-cover";
import { HeroInfo } from "./ui/hero-info";

import s from "./hero.module.scss";

export type HeroSectionProps = {
  className?: string;
  item: CollectionDetail;
};

export const HeroSection = (props: HeroSectionProps) => {
  const { className, item } = props;

  return (
    <section
      id="core"
      className={clsx(s.root, className)}
      aria-label="Overview"
      data-anchor-scroll="top"
    >
      <Container className={s.inner}>
        <div className={s.layout}>
          <HeroInfo item={item} className={s.info} />
          <HeroCover
            className={s.gallery}
            cover={item.cover}
            slug={item.slug}
          />
        </div>
      </Container>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

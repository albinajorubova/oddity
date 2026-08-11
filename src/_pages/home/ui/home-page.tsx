import { Container } from "@shared/ui/container";

import { GallerySection, HeroSection } from "./sections";

import s from "./home-page.module.scss";

export const HomePage = () => {
  return (
    <div className={s.root}>
      <Container className={s.inner}>
        <HeroSection />
        <GallerySection />
      </Container>
    </div>
  );
};

HomePage.displayName = "HomePage";

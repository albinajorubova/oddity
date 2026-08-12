import { Container } from "@shared/ui/container";

import { HeroSection } from "./sections";

import s from "./home-page.module.scss";

export const HomePage = () => {
  return (
    <div className={s.root}>
      <Container className={s.inner}>
        <HeroSection />
      </Container>
    </div>
  );
};

HomePage.displayName = "HomePage";

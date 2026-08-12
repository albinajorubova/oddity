import { Container } from "@shared/ui/container";

import { GallerySection } from "./sections";

import s from "./collections-page.module.scss";

export const CollectionsPage = () => {
  return (
    <div className={s.root}>
      <Container className={s.inner}>
        <GallerySection />
      </Container>
    </div>
  );
};

CollectionsPage.displayName = "CollectionsPage";

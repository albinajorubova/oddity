import type { CollectionItem } from "@entities/collection-card";

import { Container } from "@shared/ui/container";

import { GallerySection } from "./sections";

import s from "./collections-page.module.scss";

export type CollectionsPageProps = {
  items: CollectionItem[];
};

export const CollectionsPage = ({ items }: CollectionsPageProps) => {
  return (
    <div className={s.root}>
      <Container className={s.inner}>
        <GallerySection items={items} />
      </Container>
    </div>
  );
};

CollectionsPage.displayName = "CollectionsPage";

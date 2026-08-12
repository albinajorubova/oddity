"use client";

import clsx from "clsx";
import { useRouter } from "next/router";

import { ROUTES } from "@shared/config";
import {
  getCollectionSectionNav,
  hasDnaSection,
  hasTracksSection,
  type CollectionDetail,
} from "@/_pages/collection-detail/model";

import { SectionNav } from "./section-nav";
import { CharacterSection, HeroSection, TracksSection } from "./sections";

import s from "./collection-detail-page.module.scss";

export type CollectionDetailPageProps = {
  className?: string;
  item: CollectionDetail;
};

export const CollectionDetailPage = (props: CollectionDetailPageProps) => {
  const { className, item } = props;
  const router = useRouter();
  const sectionNav = getCollectionSectionNav(item);
  const showDna = hasDnaSection(item);
  const showTracks = hasTracksSection(item);

  const handleBack = () => {
    // back → popstate → historyScroll restore; morph делает TransitionLayout
    if (window.history.length > 1) {
      router.back();
      return;
    }
    void router.push(ROUTES.collections);
  };

  return (
    <div className={clsx(s.root, className)}>
      <button type="button" className={s.back} onClick={handleBack}>
        ← Collections
      </button>
      <SectionNav items={sectionNav} />
      <HeroSection item={item} />
      {showDna && (
        <CharacterSection
          cover={item.cover}
          characteristics={item.characteristics}
          categories={item.categories}
        />
      )}
      {showTracks && item.tracks && <TracksSection tracks={item.tracks} />}
    </div>
  );
};

CollectionDetailPage.displayName = "CollectionDetailPage";

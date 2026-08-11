"use client";

import clsx from "clsx";
import { useRouter } from "next/router";

import {
  getArchiveSectionNav,
  hasDnaSection,
  hasTracksSection,
  type ArchiveDetail,
} from "@/_pages/archive-detail/model";

import { SectionNav } from "./section-nav";
import { CharacterSection, HeroSection, TracksSection } from "./sections";

import s from "./archive-detail-page.module.scss";

export type ArchiveDetailPageProps = {
  className?: string;
  item: ArchiveDetail;
};

export const ArchiveDetailPage = (props: ArchiveDetailPageProps) => {
  const { className, item } = props;
  const router = useRouter();
  const sectionNav = getArchiveSectionNav(item);
  const showDna = hasDnaSection(item);
  const showTracks = hasTracksSection(item);

  const handleBack = () => {
    // back → popstate → historyScroll restore; morph делает TransitionLayout
    if (window.history.length > 1) {
      router.back();
      return;
    }
    void router.push("/");
  };

  return (
    <div className={clsx(s.root, className)}>
      <button type="button" className={s.back} onClick={handleBack}>
        ← Archive
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

ArchiveDetailPage.displayName = "ArchiveDetailPage";

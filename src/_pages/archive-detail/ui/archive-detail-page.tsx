import clsx from "clsx";

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
  const sectionNav = getArchiveSectionNav(item);
  const showDna = hasDnaSection(item);
  const showTracks = hasTracksSection(item);

  return (
    <main className={clsx(s.root, className)}>
      <SectionNav items={sectionNav} />
      <HeroSection item={item} />
      {showDna && (
        <CharacterSection
          title={item.title}
          gallery={item.gallery}
          characteristics={item.characteristics}
          categories={item.categories}
        />
      )}
      {showTracks && item.tracks && <TracksSection tracks={item.tracks} />}
    </main>
  );
};

ArchiveDetailPage.displayName = "ArchiveDetailPage";

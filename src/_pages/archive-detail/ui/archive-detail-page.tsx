import clsx from "clsx";

import type { ArchiveDetail } from "@/_pages/archive-detail/model";

import { HeroSection } from "./sections";

import s from "./archive-detail-page.module.scss";

export type ArchiveDetailPageProps = {
  className?: string;
  item: ArchiveDetail;
};

export const ArchiveDetailPage = (props: ArchiveDetailPageProps) => {
  const { className, item } = props;

  return (
    <main className={clsx(s.root, className)}>
      <HeroSection item={item} />
    </main>
  );
};

ArchiveDetailPage.displayName = "ArchiveDetailPage";

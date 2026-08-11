import type {
  ArchiveDetail,
  ArchiveSectionNavItem,
} from "./types";

const hasCharacteristics = (item: ArchiveDetail) => {
  const { characteristics } = item;
  if (!characteristics) return false;
  return (
    characteristics.oddity.length > 0 || characteristics.meme.length > 0
  );
};

const hasCategories = (item: ArchiveDetail) => {
  const { categories } = item;
  if (!categories) return false;
  return Object.values(categories).some((list) => Boolean(list?.length));
};

export const hasDnaSection = (item: ArchiveDetail) =>
  hasCharacteristics(item) || hasCategories(item) || Boolean(item.cover.url);

export const hasTracksSection = (item: ArchiveDetail) =>
  Boolean(item.tracks?.length);

/** Side panel items — only sections that have data. */
export const getArchiveSectionNav = (
  item: ArchiveDetail,
): ArchiveSectionNavItem[] => {
  const items: ArchiveSectionNavItem[] = [
    { id: "core", label: "Core" },
  ];

  if (hasDnaSection(item)) {
    items.push({ id: "dna", label: "DNA" });
  }

  if (hasTracksSection(item)) {
    items.push({ id: "tracks", label: "Tracks" });
  }

  return items;
};

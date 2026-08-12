import type {
  CollectionDetail,
  CollectionSectionNavItem,
} from "./types";

const hasCharacteristics = (item: CollectionDetail) => {
  const { characteristics } = item;
  if (!characteristics) return false;
  return (
    characteristics.oddity.length > 0 || characteristics.meme.length > 0
  );
};

const hasCategories = (item: CollectionDetail) => {
  const { categories } = item;
  if (!categories) return false;
  return Object.values(categories).some((list) => Boolean(list?.length));
};

export const hasDnaSection = (item: CollectionDetail) =>
  hasCharacteristics(item) || hasCategories(item) || Boolean(item.cover.url);

export const hasTracksSection = (item: CollectionDetail) =>
  Boolean(item.tracks?.length);

/** Side panel items — only sections that have data. */
export const getCollectionSectionNav = (
  item: CollectionDetail,
): CollectionSectionNavItem[] => {
  const items: CollectionSectionNavItem[] = [
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

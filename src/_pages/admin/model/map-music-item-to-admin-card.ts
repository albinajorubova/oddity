import { formatMusicItemForPage, type MusicItem } from "@entities/music-library";

import type { AdminCard } from "./types";

const PLACEHOLDER_COVER = "https://picsum.photos/seed/oddity-cover/600/600";

export const mapMusicItemToAdminCard = (item: MusicItem): AdminCard => {
  const display = formatMusicItemForPage(item);

  return {
    id: item.documentId ?? item.id ?? item.slug,
    slug: item.slug,
    title: item.title,
    credit: display.credit,
    typeLabel: display.typeLabel,
    metaLine: display.metaLine,
    year: display.year,
    shortDescription: display.shortDescription,
    imageUrl: item.coverUrl?.trim() || PLACEHOLDER_COVER,
    aspect: "square",
    publishStatus: item.curatorStatus,
  };
};

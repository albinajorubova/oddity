import type { MusicItem, MusicItemTypeSlug } from "../model";
import {
  formatArchiveMetaLine,
  formatPersonCredit,
  formatReleaseYear,
} from "@shared/lib/format-archive-card";

const MUSIC_ITEM_TYPE_LABELS: Record<MusicItemTypeSlug, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
  track: "Track",
  playlist: "Playlist",
  "live-performance": "Live",
  compilation: "Compilation",
};

export type MusicItemPageDisplay = {
  credit: string;
  typeLabel: string;
  year: number | null;
  yearLabel: string;
  duration: string | null;
  metaLine: string;
  shortDescription: string;
};

export const formatMusicItemTypeLabel = (
  slug: MusicItemTypeSlug,
): string => MUSIC_ITEM_TYPE_LABELS[slug] ?? slug;

/** Display-ready strings for archive / admin pages. */
export const formatMusicItemForPage = (item: MusicItem): MusicItemPageDisplay => {
  const typeLabel = formatMusicItemTypeLabel(item.itemTypeSlug);
  const year = formatReleaseYear(item.releaseDate);
  const credit = formatPersonCredit(item.people);
  const shortDescription = item.description?.trim() ?? "";

  return {
    credit,
    typeLabel,
    year,
    yearLabel: year != null ? String(year) : "",
    duration: item.duration,
    metaLine: formatArchiveMetaLine({ typeLabel, year }),
    shortDescription,
  };
};

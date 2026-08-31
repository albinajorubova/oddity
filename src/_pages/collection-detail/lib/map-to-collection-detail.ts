import type { ArchiveCard } from "@entities/card/model/archive-types";
import {
  formatMusicItemForPage,
  type MusicItem,
} from "@entities/music-library";

import { formatPersonCredit } from "@shared/lib/format-archive-card";

import type {
  CollectionDetail,
  CollectionStatus,
  CollectionTrack,
} from "../model/types";

const PLACEHOLDER_COVER = "https://picsum.photos/seed/oddity-cover/600/600";

const toCollectionStatus = (value: string): CollectionStatus => {
  if (value === "Ongoing" || value === "Upcoming" || value === "Restored") {
    return value;
  }

  return "Released";
};

const mapTracks = (
  tracks: MusicItem["tracks"],
): CollectionTrack[] | undefined => {
  if (!tracks?.length) return undefined;

  return tracks.flatMap((track, index) => {
    if (!track.title) return [];
    return [
      {
        id: track.youtubeId ?? String(index + 1),
        title: track.title,
        duration: track.duration ?? undefined,
      },
    ];
  });
};

export const mapMusicItemToCollectionDetail = (
  item: MusicItem,
): CollectionDetail => {
  const display = formatMusicItemForPage(item);
  const credit = display.credit;

  return {
    id: item.documentId ?? item.id ?? item.slug,
    slug: item.slug,
    title: item.title,
    year: display.year ?? 0,
    country: "—",
    duration: item.duration ?? undefined,
    status: "Released",
    shortDescription: display.shortDescription,
    artist: credit,
    availability: item.availability,
    cover: {
      url: item.coverUrl?.trim() || PLACEHOLDER_COVER,
      alt: `${credit} — ${item.title}`,
    },
    tracks: mapTracks(item.tracks),
  };
};

export const mapArchiveCardToCollectionDetail = (
  card: ArchiveCard,
): CollectionDetail => {
  const credit = formatPersonCredit(card.people, "Unknown");

  return {
    id: card.documentId ?? card.id ?? card.slug,
    slug: card.slug,
    title: card.title,
    year: card.releaseYear ?? 0,
    country: card.country?.trim() || "—",
    duration: card.duration ?? undefined,
    status: toCollectionStatus(card.releaseStatus),
    shortDescription: card.shortDescription?.trim() ?? "",
    artist: credit,
    availability: card.availability,
    cover: {
      url: card.coverUrl?.trim() || PLACEHOLDER_COVER,
      alt: `${credit} — ${card.title}`,
    },
  };
};

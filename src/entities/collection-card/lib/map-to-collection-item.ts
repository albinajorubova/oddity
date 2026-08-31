import type { ArchiveCard } from "@entities/card/model/archive-types";
import {
  formatMusicItemForPage,
  type MusicItem,
} from "@entities/music-library";

import { formatPersonCredit } from "@shared/lib/format-archive-card";

import type { CollectionItem, CollectionItemAspect } from "../model";

const PLACEHOLDER_COVER = "https://picsum.photos/seed/oddity-cover/600/600";

const CARD_TYPE_LABELS: Record<ArchiveCard["type"], string> = {
  movie: "Movie",
  series: "Series",
  anime: "Anime",
  book: "Book",
  game: "Game",
};

const aspectForArchiveType = (
  type: ArchiveCard["type"],
): CollectionItemAspect => (type === "book" ? "portrait" : "portrait");

export const mapMusicItemToCollectionItem = (
  item: MusicItem,
): CollectionItem => {
  const display = formatMusicItemForPage(item);

  return {
    id: item.documentId ?? item.id ?? item.slug,
    slug: item.slug,
    artist: display.credit,
    title: item.title,
    year: display.year ?? 0,
    category: display.typeLabel,
    imageUrl: item.coverUrl?.trim() || PLACEHOLDER_COVER,
    aspect: "square",
  };
};

export const mapArchiveCardToCollectionItem = (
  card: ArchiveCard,
): CollectionItem => ({
  id: card.documentId ?? card.id ?? card.slug,
  slug: card.slug,
  artist: formatPersonCredit(card.people, "Unknown"),
  title: card.title,
  year: card.releaseYear ?? 0,
  category: CARD_TYPE_LABELS[card.type],
  imageUrl: card.coverUrl?.trim() || PLACEHOLDER_COVER,
  aspect: aspectForArchiveType(card.type),
});

export const mapCollectionItemToOrbitItem = (
  item: CollectionItem,
  options?: { expand?: boolean },
) => ({
  id: item.id,
  src: item.imageUrl,
  alt: `${item.artist} — ${item.title}`,
  expand: options?.expand,
});

/**
 * Music library domain types.
 * Strapi storage uses shared components in `cards.*` — no junction collections.
 */

import type { PersonRef } from "@entities/person";

export type EntityTimestamps = {
  createdAt?: string;
  updatedAt?: string;
};

export type EntityId = {
  id?: string;
  documentId?: string;
};

export const MUSIC_ITEM_TYPE_SLUGS = [
  "album",
  "ep",
  "single",
  "track",
  "playlist",
  "live-performance",
  "compilation",
] as const;

export type MusicItemTypeSlug = (typeof MUSIC_ITEM_TYPE_SLUGS)[number];

export type CuratorStatus = "draft" | "public";

export type MusicTrack = {
  youtubeId: string | null;
  title: string | null;
  duration: string | null;
  artists: string[] | null;
};

export type AvailabilityLink = {
  label: string;
  href: string;
};

export type YoutubeImportKind = "song" | "album" | "playlist";

/** Shape produced by YouTube resolver — kept here to avoid card entity coupling. */
export type YoutubeImportData = {
  kind: YoutubeImportKind;
  id: string;
  title: string | null;
  artist: string | null;
  subtitle: string | null;
  description: string | null;
  thumbnail: string | null;
  duration: number | null;
  year: string | null;
  tracks: Array<{
    id: string | null;
    title: string | null;
    duration: string | null;
    artists: string[] | null;
  }> | null;
  sourceUrl: string;
};

export type { Person, PersonRef } from "@entities/person";

export type MusicItemType = EntityId &
  EntityTimestamps & {
    name: string;
    slug: MusicItemTypeSlug;
    description: string | null;
  };

export type MusicItem = EntityId &
  EntityTimestamps & {
    title: string;
    slug: string;
    itemTypeSlug: MusicItemTypeSlug;
    itemTypeId: string;
    description: string | null;
    releaseDate: string | null;
    coverUrl: string | null;
    duration: string | null;
    curatorStatus: CuratorStatus;
    youtubeId: string;
    youtubeSourceUrl: string;
    tracks: MusicTrack[] | null;
    availability: AvailabilityLink[];
    people: PersonRef[];
  };

export type CreateMusicItemInput = Omit<
  MusicItem,
  "id" | "documentId" | "createdAt" | "updatedAt"
> & {
  itemTypeDocumentId: string;
};

export type ArchiveWorkComponents = {
  people: PersonRef[];
};

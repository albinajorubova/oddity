import type { PersonRef } from "@entities/person";

import type {
  CARD_TYPES,
  CURATOR_STATUSES,
  MUSIC_KINDS,
  RELEASE_STATUSES,
} from "./constants";

export type CardType = (typeof CARD_TYPES)[number];

export type MusicKind = (typeof MUSIC_KINDS)[number];

export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export type CuratorStatus = (typeof CURATOR_STATUSES)[number];

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

/** Music card — domain DTO aligned with content model + YouTube import. */
export type MusicCard = {
  id?: string;
  documentId?: string;
  slug: string;
  type: "music";
  title: string;
  originalTitle?: string | null;
  artist: string | null;
  label?: string | null;
  releaseYear: number | null;
  country: string | null;
  duration: string | null;
  durationSeconds: number | null;
  releaseStatus: ReleaseStatus;
  shortDescription: string | null;
  fullDescription?: string | null;
  coverUrl: string | null;
  curatorStatus: CuratorStatus;
  musicKind: MusicKind;
  youtubeId: string;
  youtubeSourceUrl: string;
  youtubeSubtitle: string | null;
  tracks: MusicTrack[] | null;
  availability: AvailabilityLink[];
  people: PersonRef[];
};

export type CreateMusicCardInput = Omit<MusicCard, "id" | "documentId">;

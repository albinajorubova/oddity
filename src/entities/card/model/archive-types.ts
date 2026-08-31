import type { PersonRef } from "@entities/person";

import type {
  CARD_TYPES,
  CURATOR_STATUSES,
  RELEASE_STATUSES,
} from "./constants";

export type CardType = (typeof CARD_TYPES)[number];

export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export type CuratorStatus = (typeof CURATOR_STATUSES)[number];

export type AvailabilityLink = {
  label: string;
  href: string;
};

export type ArchiveCard = {
  id?: string;
  documentId?: string;
  slug: string;
  type: Exclude<CardType, "music">;
  title: string;
  releaseYear: number | null;
  country: string | null;
  duration: string | null;
  releaseStatus: ReleaseStatus;
  shortDescription: string | null;
  coverUrl: string | null;
  curatorStatus: CuratorStatus;
  availability: AvailabilityLink[];
  people: PersonRef[];
};

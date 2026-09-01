import { mapStrapiToArchiveCard } from "../lib/map-strapi-to-archive-card";
import type { ArchiveCard } from "../model/archive-types";

export const cardRebuild = (raw: unknown): ArchiveCard | null =>
  mapStrapiToArchiveCard(raw);

export const cardsRebuild = (entries: unknown[]): ArchiveCard[] =>
  entries
    .map(cardRebuild)
    .filter((card): card is ArchiveCard => card != null);

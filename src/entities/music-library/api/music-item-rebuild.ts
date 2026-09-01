import { mapStrapiToMusicItem } from "../lib/map-strapi-to-music-item";
import type { MusicItem } from "../model";

export const itemRebuild = (raw: unknown): MusicItem | null =>
  mapStrapiToMusicItem(raw);

export const itemsRebuild = (entries: unknown[]): MusicItem[] =>
  entries
    .map(itemRebuild)
    .filter((item): item is MusicItem => item != null);

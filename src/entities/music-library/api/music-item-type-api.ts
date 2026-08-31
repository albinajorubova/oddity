import { strapiClient } from "@shared/api/strapi";

import { getErrorDetails } from "../lib";
import { musicError, musicLog } from "../lib/logger";
import type { MusicItemType, MusicItemTypeSlug } from "../model";
import { StrapiMusicItemTypeSchema } from "../model/schemas";

export const STRAPI_MUSIC_ITEM_TYPE_COLLECTION = "music-item-types" as const;

const types = () => strapiClient.collection(STRAPI_MUSIC_ITEM_TYPE_COLLECTION);

const mapStrapiToMusicItemType = (raw: unknown): MusicItemType | null => {
  const parsed = StrapiMusicItemTypeSchema.safeParse(raw);
  if (!parsed.success) return null;

  const item = parsed.data;

  return {
    id: item.id != null ? String(item.id) : (item.documentId ?? ""),
    documentId: item.documentId,
    name: item.name,
    slug: item.slug,
    description: item.description ?? null,
  };
};

export const getMusicItemTypeBySlug = async (
  slug: MusicItemTypeSlug,
): Promise<MusicItemType | null> => {
  musicLog("getMusicItemTypeBySlug", { slug });

  try {
    const response = await types().find({
      filters: { slug: { $eq: slug } },
      pagination: { pageSize: 1 },
    });

    const first = response.data?.[0];
    const mapped = first ? mapStrapiToMusicItemType(first) : null;

    musicLog("getMusicItemTypeBySlug:result", { slug, found: Boolean(mapped) });

    return mapped;
  } catch (error) {
    musicError("getMusicItemTypeBySlug:failed", { slug, error: getErrorDetails(error) });
    throw error;
  }
};

/** Used after Strapi bootstrap seeds reference types. */
export const requireMusicItemTypeBySlug = async (
  slug: MusicItemTypeSlug,
): Promise<MusicItemType> => {
  const itemType = await getMusicItemTypeBySlug(slug);
  if (!itemType?.documentId) {
    throw new Error(`Music item type "${slug}" is missing in Strapi`);
  }

  return itemType;
};

import { strapiClient } from "@shared/api/strapi";

import { musicError, musicLog } from "../lib/logger";
import type { MusicItemType, MusicItemTypeSlug } from "../model";
import {
  STRAPI_ITEM_TYPE_COLLECTION,
  typeBySlug,
} from "./music-item-type-query";
import { typeRebuild } from "./music-item-type-rebuild";

export { STRAPI_ITEM_TYPE_COLLECTION };

const types = () => strapiClient.collection(STRAPI_ITEM_TYPE_COLLECTION);

export const getMusicItemTypeBySlug = async (
  slug: MusicItemTypeSlug,
): Promise<MusicItemType | null> => {
  musicLog("getMusicItemTypeBySlug", { slug });

  try {
    const response = await types().find(typeBySlug(slug));
    const first = response.data?.[0];
    const mapped = typeRebuild(first);

    musicLog("getMusicItemTypeBySlug:result", { slug, found: Boolean(mapped) });

    return mapped;
  } catch (error) {
    musicError("getMusicItemTypeBySlug:failed", { slug, error });
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

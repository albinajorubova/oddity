import { getPublicArchiveCardBySlug } from "@entities/card/api/archive-card-api";
import { getPublicMusicItemBySlug } from "@entities/music-library";

import {
  mapArchiveCardToCollectionDetail,
  mapMusicItemToCollectionDetail,
} from "../lib/map-to-collection-detail";
import type { CollectionDetail } from "../model/types";

export const getCollectionDetailBySlug = async (
  slug: string,
): Promise<CollectionDetail | null> => {
  const musicItem = await getPublicMusicItemBySlug(slug);
  if (musicItem) {
    return mapMusicItemToCollectionDetail(musicItem);
  }

  const archiveCard = await getPublicArchiveCardBySlug(slug);
  if (archiveCard) {
    return mapArchiveCardToCollectionDetail(archiveCard);
  }

  return null;
};

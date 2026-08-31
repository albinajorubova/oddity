import { getPublicArchiveCards } from "@entities/card/api/archive-card-api";
import { getPublicMusicItems } from "@entities/music-library";

import {
  mapArchiveCardToCollectionItem,
  mapMusicItemToCollectionItem,
} from "../lib/map-to-collection-item";
import type { CollectionItem } from "../model";

export const getPublicCollectionItems = async (): Promise<CollectionItem[]> => {
  const [musicItems, archiveCards] = await Promise.all([
    getPublicMusicItems(),
    getPublicArchiveCards(),
  ]);

  return [
    ...musicItems.map(mapMusicItemToCollectionItem),
    ...archiveCards.map(mapArchiveCardToCollectionItem),
  ];
};

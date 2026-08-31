import { getAllMusicItems, musicLog } from "@entities/music-library";

import { mapMusicItemToAdminCard } from "../model/map-music-item-to-admin-card";
import type { AdminCard } from "../model/types";

export const getAdminCards = async (): Promise<AdminCard[]> => {
  musicLog("getAdminCards:start");

  const items = await getAllMusicItems();
  const mapped = items.map(mapMusicItemToAdminCard);

  musicLog("getAdminCards:success", { count: mapped.length });

  return mapped;
};

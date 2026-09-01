import {
  musicError,
  musicLog,
  updateMusicItemCuratorStatus,
} from "@entities/music-library";

import { mapMusicItemToAdminCard } from "../model/map-music-item-to-admin-card";
import type { AdminCard, PublishStatus } from "../model/types";

export type UpdateCardPublishStatusResult =
  | { ok: true; card: AdminCard }
  | { ok: false; error: string };

export const updateCardPublishStatus = async (
  documentId: string,
  publishStatus: PublishStatus,
): Promise<UpdateCardPublishStatusResult> => {
  musicLog("updateCardPublishStatus:start", { documentId, publishStatus });

  try {
    const updated = await updateMusicItemCuratorStatus(
      documentId,
      publishStatus,
      { status: "draft" },
    );

    if (!updated) {
      musicError("updateCardPublishStatus:null-response", { documentId });
      return { ok: false, error: "Failed to update card status" };
    }

    musicLog("updateCardPublishStatus:success", {
      documentId,
      publishStatus: updated.curatorStatus,
    });

    return {
      ok: true,
      card: mapMusicItemToAdminCard(updated),
    };
  } catch (error) {
    musicError("updateCardPublishStatus:failed", error);
    const message =
      error instanceof Error ? error.message : "Failed to update card status";
    return { ok: false, error: message };
  }
};

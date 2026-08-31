import {
  createMusicItem,
  getMusicItemByYoutubeId,
  musicError,
  musicLog,
} from "@entities/music-library";

import { mapMusicItemToAdminCard } from "../model/map-music-item-to-admin-card";
import type { AdminCard } from "../model/types";
import { buildMusicItemInputFromYoutube } from "./build-music-item-from-youtube";
import { resolveYoutubeUrl } from "./resolve-youtube";

export type CreateCardFromUrlResult =
  | { ok: true; card: AdminCard; created: boolean }
  | { ok: false; error: string };

export const createCardFromUrl = async (
  url: string,
): Promise<CreateCardFromUrlResult> => {
  const trimmed = url.trim();
  musicLog("createCardFromUrl:start", { url: trimmed });

  if (!trimmed) {
    musicLog("createCardFromUrl:empty-url");
    return { ok: false, error: "Empty URL" };
  }

  const resolved = await resolveYoutubeUrl(trimmed);
  if (!resolved.ok) {
    musicLog("createCardFromUrl:resolve-failed", resolved.error);
    return resolved;
  }

  musicLog("createCardFromUrl:resolved", {
    kind: resolved.data.kind,
    youtubeId: resolved.data.id,
    title: resolved.data.title,
  });

  const existing = await getMusicItemByYoutubeId(resolved.data.id);
  if (existing) {
    musicLog("createCardFromUrl:existing", {
      slug: existing.slug,
      documentId: existing.documentId,
    });

    return {
      ok: true,
      card: mapMusicItemToAdminCard(existing),
      created: false,
    };
  }

  try {
    const input = await buildMusicItemInputFromYoutube(resolved.data, {
      status: "draft",
    });
    const created = await createMusicItem(input, { status: "draft" });

    if (!created) {
      musicError("createCardFromUrl:strapi-null-response");
      return { ok: false, error: "Failed to save music item to Strapi" };
    }

    musicLog("createCardFromUrl:created", {
      slug: created.slug,
      documentId: created.documentId,
    });

    return {
      ok: true,
      card: mapMusicItemToAdminCard(created),
      created: true,
    };
  } catch (error) {
    musicError("createCardFromUrl:failed", error);
    throw error;
  }
};

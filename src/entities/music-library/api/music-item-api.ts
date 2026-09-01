import { createStrapiCollection } from "@shared/api/strapi";

import {
  hydrateMusicItemPeople,
  hydrateMusicItemsPeople,
  mapMusicItemToStrapiPayload,
} from "../lib";
import {
  coalesceMusicItemFromDraft,
  coalescePublishedWithDrafts,
  mergeDraftAndPublishedMusicItems,
} from "../lib/coalesce-music-item-from-draft";
import { musicError, musicLog } from "../lib/logger";
import type { CreateMusicItemInput, CuratorStatus, MusicItem } from "../model";
import {
  itemBySlug,
  itemByYoutube,
  items,
  type MusicItemFindOptions,
  mutation,
  STRAPI_MUSIC_ITEM_COLLECTION,
} from "./music-item-query";
import { itemRebuild, itemsRebuild } from "./music-item-rebuild";
import { STRAPI_ITEM_TYPE_COLLECTION } from "./music-item-type-query";

export { STRAPI_MUSIC_ITEM_COLLECTION, STRAPI_ITEM_TYPE_COLLECTION };

const musicItems = createStrapiCollection(STRAPI_MUSIC_ITEM_COLLECTION);

const withHydratedPeople = async (
  item: MusicItem | null,
  options?: {
    status?: "draft" | "published";
    fallbackPeople?: CreateMusicItemInput["people"];
  },
): Promise<MusicItem | null> => {
  if (!item) return null;

  let hydrated = await hydrateMusicItemPeople(item, options);

  if (
    options?.fallbackPeople?.length &&
    !hydrated.people.some((ref) => ref.person?.name?.trim())
  ) {
    hydrated = { ...hydrated, people: options.fallbackPeople };
  }

  return hydrated;
};

const itemIdentityKey = (item: MusicItem): string =>
  item.documentId ?? item.slug ?? item.id ?? item.youtubeId;

const mergeMusicItems = (lists: MusicItem[][]): MusicItem[] => {
  if (lists.length === 2 && lists[0] && lists[1]) {
    return mergeDraftAndPublishedMusicItems(lists[0], lists[1]);
  }

  return [
    ...new Map(
      lists.flat().map((item) => [itemIdentityKey(item), item] as const),
    ).values(),
  ];
};

const withDraftFallback = async (
  item: MusicItem | null,
  slug: string,
  options?: MusicItemFindOptions,
): Promise<MusicItem | null> => {
  if (!item || options?.status !== "published") {
    return item;
  }

  if (item.people.some((ref) => ref.person?.name?.trim())) {
    return item;
  }

  const draft = await getMusicItemBySlug(slug, {
    status: "draft",
    curatorStatus: options.curatorStatus,
  });

  return coalesceMusicItemFromDraft(item, draft);
};

export const createMusicItem = async (
  input: CreateMusicItemInput,
  options?: { status?: "draft" | "published" },
): Promise<MusicItem | null> => {
  musicLog("createMusicItem:start", {
    slug: input.slug,
    title: input.title,
    youtubeId: input.youtubeId,
    itemType: input.itemTypeSlug,
    status: options?.status,
  });

  const payload = mapMusicItemToStrapiPayload(input);
  musicLog("createMusicItem:payload", payload);

  try {
    const response = await musicItems.create(
      payload,
      mutation(options?.status),
    );

    musicLog("createMusicItem:success", {
      documentId: response.data?.documentId,
      id: response.data?.id,
    });

    return withHydratedPeople(itemRebuild(response.data), {
      status: options?.status,
      fallbackPeople: input.people,
    });
  } catch (error) {
    musicError("createMusicItem:failed", error);
    throw error;
  }
};

export const updateMusicItemCuratorStatus = async (
  documentId: string,
  curatorStatus: CuratorStatus,
  options?: { status?: "draft" | "published" },
): Promise<MusicItem | null> => {
  musicLog("updateMusicItemCuratorStatus:start", {
    documentId,
    curatorStatus,
    status: options?.status,
  });

  try {
    const response = await musicItems.update(
      documentId,
      { curatorStatus },
      mutation(options?.status),
    );

    musicLog("updateMusicItemCuratorStatus:success", {
      documentId: response.data?.documentId,
    });

    return withHydratedPeople(itemRebuild(response.data), {
      status: options?.status,
    });
  } catch (error) {
    musicError("updateMusicItemCuratorStatus:failed", error);
    throw error;
  }
};

export const getMusicItems = async (
  options?: MusicItemFindOptions,
): Promise<MusicItem[]> => {
  musicLog("getMusicItems:start", options);

  try {
    const response = await musicItems.find(items(options));
    const mapped = itemsRebuild(response.data ?? []);
    const hydrated = await hydrateMusicItemsPeople(mapped, options);

    musicLog("getMusicItems:success", { count: hydrated.length });

    return hydrated;
  } catch (error) {
    musicError("getMusicItems:failed", error);
    throw error;
  }
};

export const getAllMusicItems = async (
  options?: Pick<MusicItemFindOptions, "curatorStatus">,
): Promise<MusicItem[]> => {
  musicLog("getAllMusicItems:start", options);

  const [drafts, published] = await Promise.all([
    getMusicItems({ ...options, status: "draft" }),
    getMusicItems({ ...options, status: "published" }),
  ]);

  const merged = mergeMusicItems([drafts, published]);

  musicLog("getAllMusicItems:success", {
    drafts: drafts.length,
    published: published.length,
    total: merged.length,
  });

  return merged;
};

export const getPublicMusicItems = async (): Promise<MusicItem[]> => {
  const [published, drafts] = await Promise.all([
    getMusicItems({ status: "published", curatorStatus: "public" }),
    getMusicItems({ status: "draft" }),
  ]);

  return coalescePublishedWithDrafts(published, drafts);
};

export const getMusicItemBySlug = async (
  slug: string,
  options?: MusicItemFindOptions,
): Promise<MusicItem | null> => {
  musicLog("getMusicItemBySlug", { slug, ...options });

  try {
    const first = await musicItems.findFirst(itemBySlug(slug, options));
    const mapped = itemRebuild(first);

    musicLog("getMusicItemBySlug:result", { slug, found: Boolean(mapped) });

    const hydrated = await withHydratedPeople(mapped, {
      status: options?.status,
    });

    return withDraftFallback(hydrated, slug, options);
  } catch (error) {
    musicError("getMusicItemBySlug:failed", { slug, error });
    throw error;
  }
};

export const getPublicMusicItemBySlug = (
  slug: string,
): Promise<MusicItem | null> =>
  getMusicItemBySlug(slug, {
    status: "published",
    curatorStatus: "public",
  });

export const getMusicItemByYoutubeId = async (
  youtubeId: string,
  options?: Pick<MusicItemFindOptions, "status">,
): Promise<MusicItem | null> => {
  musicLog("getMusicItemByYoutubeId", { youtubeId, status: options?.status });

  if (options?.status) {
    return findMusicItemByYoutubeId(youtubeId, options.status);
  }

  const draft = await findMusicItemByYoutubeId(youtubeId, "draft");
  if (draft) return draft;

  return findMusicItemByYoutubeId(youtubeId, "published");
};

const findMusicItemByYoutubeId = async (
  youtubeId: string,
  status: "draft" | "published",
): Promise<MusicItem | null> => {
  try {
    const first = await musicItems.findFirst(itemByYoutube(youtubeId, status));
    const mapped = itemRebuild(first);

    musicLog("getMusicItemByYoutubeId:result", {
      youtubeId,
      status,
      found: Boolean(mapped),
    });

    return withHydratedPeople(mapped, { status });
  } catch (error) {
    musicError("getMusicItemByYoutubeId:failed", { youtubeId, status, error });
    throw error;
  }
};

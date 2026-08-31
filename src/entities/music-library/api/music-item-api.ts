import { strapiClient } from "@shared/api/strapi";
import { STRAPI_CONFIG } from "@shared/config";

import {
  getErrorDetails,
  hydrateMusicItemPeople,
  hydrateMusicItemsPeople,
  mapMusicItemToStrapiPayload,
  mapStrapiToMusicItem,
} from "../lib";
import {
  coalesceMusicItemFromDraft,
  coalescePublishedWithDrafts,
  mergeDraftAndPublishedMusicItems,
} from "../lib/coalesce-music-item-from-draft";
import { musicError, musicLog } from "../lib/logger";
import type { CreateMusicItemInput, MusicItem } from "../model";
import { STRAPI_MUSIC_ITEM_TYPE_COLLECTION } from "./music-item-type-api";

export const STRAPI_MUSIC_ITEM_COLLECTION = "music-items" as const;

type MusicItemFindOptions = {
  status?: "draft" | "published";
  curatorStatus?: "draft" | "public";
};

const items = () => strapiClient.collection(STRAPI_MUSIC_ITEM_COLLECTION);

const basePopulate = {
  itemType: true,
  tracks: true,
  availability: true,
  people: { populate: { person: true } },
} as const;

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

  const merged = new Map<string, MusicItem>();

  for (const list of lists) {
    for (const item of list) {
      merged.set(itemIdentityKey(item), item);
    }
  }

  return [...merged.values()];
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

const logStrapiConfig = (): void => {
  musicLog("strapi config", {
    baseURL: STRAPI_CONFIG.strapiNetworkUrl,
    hasToken: Boolean(STRAPI_CONFIG.strapiApiToken),
    collection: STRAPI_MUSIC_ITEM_COLLECTION,
  });
};

export const createMusicItem = async (
  input: CreateMusicItemInput,
  options?: { status?: "draft" | "published" },
): Promise<MusicItem | null> => {
  logStrapiConfig();
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
    const queryParams: Parameters<ReturnType<typeof items>["create"]>[1] = {
      populate: basePopulate,
      ...(options?.status ? { status: options.status } : {}),
    };

    const response = await items().create(payload, queryParams);

    musicLog("createMusicItem:success", {
      documentId: response.data?.documentId,
      id: response.data?.id,
    });

    const mapped = mapStrapiToMusicItem(response.data);

    return withHydratedPeople(mapped, {
      status: options?.status,
      fallbackPeople: input.people,
    });
  } catch (error) {
    musicError("createMusicItem:failed", getErrorDetails(error));
    throw error;
  }
};

export const getMusicItems = async (
  options?: MusicItemFindOptions,
): Promise<MusicItem[]> => {
  logStrapiConfig();
  musicLog("getMusicItems:start", options);

  const filters: Record<string, unknown> = {};

  if (options?.curatorStatus) {
    filters.curatorStatus = { $eq: options.curatorStatus };
  }

  const findOptions: Parameters<ReturnType<typeof items>["find"]>[0] = {
    filters,
    populate: basePopulate,
    sort: ["createdAt:desc"],
  };

  if (options?.status) {
    findOptions.status = options.status;
  }

  try {
    const response = await items().find(findOptions);
    const mapped = (response.data ?? []).flatMap((entry) => {
      const item = mapStrapiToMusicItem(entry);
      return item ? [item] : [];
    });

    const hydrated = await hydrateMusicItemsPeople(mapped, options);

    musicLog("getMusicItems:success", { count: hydrated.length });

    return hydrated;
  } catch (error) {
    musicError("getMusicItems:failed", getErrorDetails(error));
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

  const filters: Record<string, unknown> = {
    slug: { $eq: slug },
  };

  if (options?.curatorStatus) {
    filters.curatorStatus = { $eq: options.curatorStatus };
  }

  const findOptions: Parameters<ReturnType<typeof items>["find"]>[0] = {
    filters,
    populate: basePopulate,
    pagination: { pageSize: 1 },
  };

  if (options?.status) {
    findOptions.status = options.status;
  }

  try {
    const response = await items().find(findOptions);
    const first = response.data?.[0];
    const mapped = first ? mapStrapiToMusicItem(first) : null;

    musicLog("getMusicItemBySlug:result", { slug, found: Boolean(mapped) });

    const hydrated = await withHydratedPeople(mapped, {
      status: options?.status,
    });

    return withDraftFallback(hydrated, slug, options);
  } catch (error) {
    musicError("getMusicItemBySlug:failed", {
      slug,
      error: getErrorDetails(error),
    });
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
  const findOptions: Parameters<ReturnType<typeof items>["find"]>[0] = {
    filters: {
      youtubeId: { $eq: youtubeId },
    },
    populate: basePopulate,
    pagination: { pageSize: 1 },
    status,
  };

  try {
    const response = await items().find(findOptions);
    const first = response.data?.[0];
    const mapped = first ? mapStrapiToMusicItem(first) : null;

    musicLog("getMusicItemByYoutubeId:result", {
      youtubeId,
      status,
      found: Boolean(mapped),
    });

    return withHydratedPeople(mapped, { status });
  } catch (error) {
    musicError("getMusicItemByYoutubeId:failed", {
      youtubeId,
      status,
      error: getErrorDetails(error),
    });
    throw error;
  }
};

export { STRAPI_MUSIC_ITEM_TYPE_COLLECTION };

import { strapiClient } from "@shared/api/strapi";
import { STRAPI_CONFIG } from "@shared/config";

import {
  mapMusicCardToStrapiPayload,
  mapStrapiToMusicCard,
  mapYoutubeToMusicCard,
} from "../lib";
import { cardError, cardLog } from "../lib/logger";
import { getErrorDetails } from "../lib/sanitize-strapi-payload";
import {
  type CreateMusicCardInput,
  type MusicCard,
  STRAPI_CARD_COLLECTION,
} from "../model";
import type { YoutubeResolvedData } from "../model/schemas";

type CardFindOptions = {
  status?: "draft" | "published";
  curatorStatus?: "draft" | "public";
};

const cards = () => strapiClient.collection(STRAPI_CARD_COLLECTION);

const basePopulate = {
  tracks: true,
  availability: true,
  cover: true,
  people: { populate: { person: true } },
} as const;

const cardIdentityKey = (card: MusicCard): string =>
  card.documentId ?? card.id ?? card.youtubeId ?? card.slug;

const mergeMusicCards = (lists: MusicCard[][]): MusicCard[] => {
  const merged = new Map<string, MusicCard>();

  for (const list of lists) {
    for (const card of list) {
      merged.set(cardIdentityKey(card), card);
    }
  }

  return [...merged.values()];
};

const logStrapiConfig = (): void => {
  cardLog("strapi config", {
    baseURL: STRAPI_CONFIG.strapiNetworkUrl,
    hasToken: Boolean(STRAPI_CONFIG.strapiApiToken),
    collection: STRAPI_CARD_COLLECTION,
  });
};

export const createMusicCard = async (
  input: CreateMusicCardInput,
  options?: { status?: "draft" | "published" },
): Promise<MusicCard | null> => {
  logStrapiConfig();
  cardLog("createMusicCard:start", {
    slug: input.slug,
    title: input.title,
    youtubeId: input.youtubeId,
    status: options?.status,
  });

  const payload = mapMusicCardToStrapiPayload(input);
  cardLog("createMusicCard:payload", payload);

  try {
    const queryParams: Parameters<ReturnType<typeof cards>["create"]>[1] = {
      populate: basePopulate,
      ...(options?.status ? { status: options.status } : {}),
    };

    const response = await cards().create(payload, queryParams);

    cardLog("createMusicCard:success", {
      documentId: response.data?.documentId,
      id: response.data?.id,
    });

    return mapStrapiToMusicCard(response.data);
  } catch (error) {
    cardError("createMusicCard:failed", getErrorDetails(error));
    throw error;
  }
};

export const createMusicCardFromYoutube = async (
  data: YoutubeResolvedData,
  options?: { status?: "draft" | "published" },
): Promise<MusicCard | null> => {
  cardLog("createMusicCardFromYoutube", {
    kind: data.kind,
    youtubeId: data.id,
    title: data.title,
  });

  const input = mapYoutubeToMusicCard(data);
  return createMusicCard(input, options);
};

export const getMusicCards = async (
  options?: CardFindOptions,
): Promise<MusicCard[]> => {
  logStrapiConfig();
  cardLog("getMusicCards:start", options);

  const filters: Record<string, unknown> = {
    type: { $eq: "music" },
  };

  if (options?.curatorStatus) {
    filters.curatorStatus = { $eq: options.curatorStatus };
  }

  const findOptions: Parameters<ReturnType<typeof cards>["find"]>[0] = {
    filters,
    populate: basePopulate,
    sort: ["createdAt:desc"],
  };

  if (options?.status) {
    findOptions.status = options.status;
  }

  try {
    const response = await cards().find(findOptions);
    const mapped = (response.data ?? []).flatMap((item) => {
      const card = mapStrapiToMusicCard(item);
      return card ? [card] : [];
    });

    cardLog("getMusicCards:success", { count: mapped.length });

    return mapped;
  } catch (error) {
    cardError("getMusicCards:failed", getErrorDetails(error));
    throw error;
  }
};

/** Draft + published entries for admin / preview surfaces. */
export const getAllMusicCards = async (
  options?: Pick<CardFindOptions, "curatorStatus">,
): Promise<MusicCard[]> => {
  cardLog("getAllMusicCards:start", options);

  const [drafts, published] = await Promise.all([
    getMusicCards({ ...options, status: "draft" }),
    getMusicCards({ ...options, status: "published" }),
  ]);

  const merged = mergeMusicCards([drafts, published]);

  cardLog("getAllMusicCards:success", {
    drafts: drafts.length,
    published: published.length,
    total: merged.length,
  });

  return merged;
};

export const getMusicCardBySlug = async (
  slug: string,
  options?: Pick<CardFindOptions, "status">,
): Promise<MusicCard | null> => {
  cardLog("getMusicCardBySlug", { slug, status: options?.status });

  const findOptions: Parameters<ReturnType<typeof cards>["find"]>[0] = {
    filters: {
      slug: { $eq: slug },
      type: { $eq: "music" },
    },
    populate: basePopulate,
    pagination: { pageSize: 1 },
  };

  if (options?.status) {
    findOptions.status = options.status;
  }

  try {
    const response = await cards().find(findOptions);
    const first = response.data?.[0];
    const mapped = first ? mapStrapiToMusicCard(first) : null;

    cardLog("getMusicCardBySlug:result", { found: Boolean(mapped) });

    return mapped;
  } catch (error) {
    cardError("getMusicCardBySlug:failed", {
      slug,
      error: getErrorDetails(error),
    });
    throw error;
  }
};

export const getMusicCardByYoutubeId = async (
  youtubeId: string,
  options?: Pick<CardFindOptions, "status">,
): Promise<MusicCard | null> => {
  cardLog("getMusicCardByYoutubeId", { youtubeId, status: options?.status });

  if (options?.status) {
    return findMusicCardByYoutubeId(youtubeId, options.status);
  }

  const draft = await findMusicCardByYoutubeId(youtubeId, "draft");
  if (draft) return draft;

  return findMusicCardByYoutubeId(youtubeId, "published");
};

const findMusicCardByYoutubeId = async (
  youtubeId: string,
  status: "draft" | "published",
): Promise<MusicCard | null> => {
  const findOptions: Parameters<ReturnType<typeof cards>["find"]>[0] = {
    filters: {
      youtubeId: { $eq: youtubeId },
      type: { $eq: "music" },
    },
    populate: basePopulate,
    pagination: { pageSize: 1 },
    status,
  };

  try {
    const response = await cards().find(findOptions);
    const first = response.data?.[0];
    const mapped = first ? mapStrapiToMusicCard(first) : null;

    cardLog("getMusicCardByYoutubeId:result", {
      youtubeId,
      status,
      found: Boolean(mapped),
    });

    return mapped;
  } catch (error) {
    cardError("getMusicCardByYoutubeId:failed", {
      youtubeId,
      status,
      error: getErrorDetails(error),
    });
    throw error;
  }
};

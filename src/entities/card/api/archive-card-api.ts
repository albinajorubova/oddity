import { strapiClient } from "@shared/api/strapi";

import { cardError, cardLog } from "../lib/logger";
import { mapStrapiToArchiveCard } from "../lib/map-strapi-to-archive-card";
import { getErrorDetails } from "../lib/sanitize-strapi-payload";
import type { ArchiveCard } from "../model/archive-types";
import { STRAPI_CARD_COLLECTION } from "../model/constants";

type ArchiveCardFindOptions = {
  status?: "draft" | "published";
  curatorStatus?: "draft" | "public";
};

const cards = () => strapiClient.collection(STRAPI_CARD_COLLECTION);

const basePopulate = {
  availability: true,
  cover: true,
  people: { populate: { person: true } },
} as const;

const NON_MUSIC_TYPES = ["movie", "series", "anime", "book", "game"] as const;

export const getArchiveCards = async (
  options?: ArchiveCardFindOptions,
): Promise<ArchiveCard[]> => {
  cardLog("getArchiveCards:start", options);

  const filters: Record<string, unknown> = {
    type: { $in: NON_MUSIC_TYPES },
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
      const card = mapStrapiToArchiveCard(item);
      return card ? [card] : [];
    });

    cardLog("getArchiveCards:success", { count: mapped.length });

    return mapped;
  } catch (error) {
    cardError("getArchiveCards:failed", getErrorDetails(error));
    throw error;
  }
};

export const getPublicArchiveCards = (): Promise<ArchiveCard[]> =>
  getArchiveCards({ status: "published", curatorStatus: "public" });

export const getArchiveCardBySlug = async (
  slug: string,
  options?: ArchiveCardFindOptions,
): Promise<ArchiveCard | null> => {
  cardLog("getArchiveCardBySlug", { slug, ...options });

  const findOptions: Parameters<ReturnType<typeof cards>["find"]>[0] = {
    filters: {
      slug: { $eq: slug },
      type: { $in: NON_MUSIC_TYPES },
    },
    populate: basePopulate,
    pagination: { pageSize: 1 },
  };

  if (options?.status) {
    findOptions.status = options.status;
  }

  if (options?.curatorStatus) {
    findOptions.filters = {
      ...findOptions.filters,
      curatorStatus: { $eq: options.curatorStatus },
    };
  }

  try {
    const response = await cards().find(findOptions);
    const first = response.data?.[0];
    const mapped = first ? mapStrapiToArchiveCard(first) : null;

    cardLog("getArchiveCardBySlug:result", { slug, found: Boolean(mapped) });

    return mapped;
  } catch (error) {
    cardError("getArchiveCardBySlug:failed", {
      slug,
      error: getErrorDetails(error),
    });
    throw error;
  }
};

export const getPublicArchiveCardBySlug = (
  slug: string,
): Promise<ArchiveCard | null> =>
  getArchiveCardBySlug(slug, {
    status: "published",
    curatorStatus: "public",
  });

import type { StrapiFindQuery } from "@shared/api/strapi";
import { peoplePopulate } from "@shared/api/strapi/query";

import { STRAPI_CARD_COLLECTION } from "../model/constants";

export type ArchiveCardFindOptions = {
  status?: "draft" | "published";
  curatorStatus?: "draft" | "public";
};

export const NON_MUSIC_TYPES = [
  "movie",
  "series",
  "anime",
  "book",
  "game",
] as const;

export const cardPopulate = {
  availability: true,
  cover: true,
  ...peoplePopulate,
} as const;

const filters = (options?: ArchiveCardFindOptions) => {
  const result: Record<string, unknown> = {
    type: { $in: NON_MUSIC_TYPES },
  };

  if (options?.curatorStatus) {
    result.curatorStatus = { $eq: options.curatorStatus };
  }

  return result;
};

export const cards = (options?: ArchiveCardFindOptions): StrapiFindQuery => ({
  filters: filters(options),
  populate: cardPopulate,
  sort: ["createdAt:desc"],
  status: options?.status,
});

export const cardBySlug = (
  slug: string,
  options?: ArchiveCardFindOptions,
): StrapiFindQuery => {
  const slugFilters: Record<string, unknown> = {
    slug: { $eq: slug },
    type: { $in: NON_MUSIC_TYPES },
  };

  if (options?.curatorStatus) {
    slugFilters.curatorStatus = { $eq: options.curatorStatus };
  }

  return {
    filters: slugFilters,
    populate: cardPopulate,
    pagination: { pageSize: 1 },
    status: options?.status,
  };
};

export { STRAPI_CARD_COLLECTION };

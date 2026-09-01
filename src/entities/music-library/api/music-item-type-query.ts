import type { StrapiFindQuery } from "@shared/api/strapi";

export const STRAPI_ITEM_TYPE_COLLECTION = "music-item-types" as const;

export const typeBySlug = (slug: string): StrapiFindQuery => ({
  filters: { slug: { $eq: slug } },
  pagination: { pageSize: 1 },
});

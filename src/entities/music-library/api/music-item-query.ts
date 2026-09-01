import type { StrapiFindQuery, StrapiMutationQuery } from "@shared/api/strapi";
import { peoplePopulate } from "@shared/api/strapi/query";
import { compact } from "@shared/lib/compact";

export const STRAPI_MUSIC_ITEM_COLLECTION = "music-items" as const;

export type MusicItemFindOptions = {
  status?: "draft" | "published";
  curatorStatus?: "draft" | "public";
};

export const itemPopulate = {
  itemType: true,
  tracks: true,
  availability: true,
  ...peoplePopulate,
} as const;

const filters = (options?: MusicItemFindOptions) =>
  compact({
    curatorStatus: options?.curatorStatus
      ? { $eq: options.curatorStatus }
      : undefined,
  });

export const items = (options?: MusicItemFindOptions): StrapiFindQuery => ({
  filters: filters(options),
  populate: itemPopulate,
  sort: ["createdAt:desc"],
  status: options?.status,
});

export const itemBySlug = (
  slug: string,
  options?: MusicItemFindOptions,
): StrapiFindQuery => ({
  filters: {
    slug: { $eq: slug },
    ...filters(options),
  },
  populate: itemPopulate,
  status: options?.status,
});

export const itemByYoutube = (
  youtubeId: string,
  status: "draft" | "published",
): StrapiFindQuery => ({
  filters: { youtubeId: { $eq: youtubeId } },
  populate: itemPopulate,
  status,
});

export const mutation = (
  status?: "draft" | "published",
): StrapiMutationQuery => compact({ populate: itemPopulate, status });

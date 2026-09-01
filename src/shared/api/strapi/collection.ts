import { compact } from "@shared/lib/compact";

import { strapiClient } from "./strapi-client";
import type { StrapiFindQuery, StrapiMutationQuery } from "./types";

export const createStrapiCollection = (collectionName: string) => {
  const collection = () => strapiClient.collection(collectionName);

  return {
    name: collectionName,
    collection,
    find: (query?: StrapiFindQuery) =>
      collection().find(compact(query ?? {})),
    findFirst: async (query?: StrapiFindQuery) =>
      (
        await collection().find(
          compact({
            ...query,
            pagination: { pageSize: 1, ...query?.pagination },
          }),
        )
      ).data?.[0] ?? null,
    create: (data: Record<string, unknown>, query?: StrapiMutationQuery) =>
      collection().create(data, compact(query ?? {})),
    update: (
      documentId: string,
      data: Record<string, unknown>,
      query?: StrapiMutationQuery,
    ) =>
      collection().update(documentId, data, compact(query ?? {})),
  };
};

export type StrapiCollection = ReturnType<typeof createStrapiCollection>;

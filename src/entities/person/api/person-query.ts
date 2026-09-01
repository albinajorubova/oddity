import type { StrapiFindQuery, StrapiMutationQuery } from "@shared/api/strapi";
import { compact } from "@shared/lib/compact";

export const STRAPI_PERSON_COLLECTION = "people" as const;

export const byName = (
  name: string,
  status: "draft" | "published",
): StrapiFindQuery => ({
  filters: { name: { $eqi: name } },
  pagination: { pageSize: 1 },
  status,
});

export const createOpts = (
  status?: "draft" | "published",
): StrapiMutationQuery => compact({ status });

export const byDocId = (
  status: "draft" | "published",
): StrapiMutationQuery => ({ status });

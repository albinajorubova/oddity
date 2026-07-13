export const DEBOUNCE_MS = 2000;

export const SINGLE_TYPES = "single-types";

export const COLLECTION_TYPES = "collection-types";

export const INTERNAL_FIELDS = [
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
  "localizations",
  "__temp_key__",
  "strapi_assignee",
  "strapi_stage",
] as const;

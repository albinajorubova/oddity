import { z } from "zod";

import type { Person } from "../model/types";

const StrapiPersonSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const mapStrapiToPerson = (raw: unknown): Person | null => {
  const parsed = StrapiPersonSchema.safeParse(raw);
  if (!parsed.success) return null;

  const item = parsed.data;

  return {
    id: item.id != null ? String(item.id) : (item.documentId ?? ""),
    documentId: item.documentId,
    name: item.name,
    slug: item.slug ?? null,
    description: item.description ?? null,
    imageUrl: item.imageUrl ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

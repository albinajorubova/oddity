import type { MusicItemType } from "../model";
import { StrapiMusicItemTypeSchema } from "../model/schemas";

export const typeRebuild = (raw: unknown): MusicItemType | null => {
  const parsed = StrapiMusicItemTypeSchema.safeParse(raw);
  if (!parsed.success) return null;

  const item = parsed.data;

  return {
    id: item.id != null ? String(item.id) : (item.documentId ?? ""),
    documentId: item.documentId,
    name: item.name,
    slug: item.slug,
    description: item.description ?? null,
  };
};

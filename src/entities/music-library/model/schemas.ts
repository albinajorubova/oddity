import { z } from "zod";

import { MUSIC_ITEM_TYPE_SLUGS } from "./types";

export const MusicTrackSchema = z.object({
  youtubeId: z.string().nullable(),
  title: z.string().nullable(),
  duration: z.string().nullable(),
  artists: z.array(z.string()).nullable(),
});

export const AvailabilityLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
});

export const MusicItemSchema = z.object({
  id: z.string().optional(),
  documentId: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  itemTypeSlug: z.enum(MUSIC_ITEM_TYPE_SLUGS),
  itemTypeId: z.string().min(1),
  description: z.string().nullable(),
  releaseDate: z.string().nullable(),
  coverUrl: z.string().nullable(),
  duration: z.string().nullable(),
  curatorStatus: z.enum(["draft", "public"]),
  youtubeId: z.string().min(1),
  youtubeSourceUrl: z.string().url(),
  tracks: z.array(MusicTrackSchema).nullable(),
  availability: z.array(AvailabilityLinkSchema),
  people: z
    .array(
      z.object({
        id: z.number().optional(),
        person: z
          .object({
            id: z.union([z.string(), z.number()]).optional(),
            documentId: z.string().optional(),
            name: z.string(),
          })
          .nullable(),
      }),
    )
    .default([]),
});

export const CreateMusicItemInputSchema = MusicItemSchema.omit({
  id: true,
  documentId: true,
}).extend({
  itemTypeDocumentId: z.string().min(1),
});

export const StrapiMusicItemTypeSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  name: z.string(),
  slug: z.enum(MUSIC_ITEM_TYPE_SLUGS),
  description: z.string().nullable().optional(),
});

export const StrapiMusicTrackComponentSchema = z.object({
  id: z.number().optional(),
  youtubeId: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  artists: z.array(z.string()).nullable().optional(),
});

export const StrapiAvailabilityLinkSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  url: z.string(),
  target_blank: z.boolean().optional(),
});

export const StrapiMusicItemSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  slug: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  curatorStatus: z.enum(["draft", "public"]).nullable().optional(),
  youtubeId: z.string().nullable().optional(),
  youtubeSourceUrl: z.string().nullable().optional(),
  itemType: StrapiMusicItemTypeSchema.nullable().optional(),
  tracks: z.array(StrapiMusicTrackComponentSchema).nullable().optional(),
  availability: z.array(StrapiAvailabilityLinkSchema).nullable().optional(),
  people: z
    .array(
      z.object({
        id: z.number().optional(),
        person: z.unknown().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type StrapiMusicItem = z.infer<typeof StrapiMusicItemSchema>;

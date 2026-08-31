import { z } from "zod";

import {
  CARD_TYPES,
  CURATOR_STATUSES,
  MUSIC_KINDS,
  RELEASE_STATUSES,
} from "./constants";

export const YoutubeResolvedTrackSchema = z.object({
  id: z.string().nullable(),
  title: z.string().nullable(),
  duration: z.string().nullable(),
  artists: z.array(z.string()).nullable(),
});

export const YoutubeResolvedDataSchema = z.object({
  kind: z.enum(MUSIC_KINDS),
  id: z.string().min(1),
  title: z.string().nullable(),
  artist: z.string().nullable(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  duration: z.number().nullable(),
  year: z.string().nullable(),
  tracks: z.array(YoutubeResolvedTrackSchema).nullable(),
  sourceUrl: z.string().min(1),
});

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

export const MusicCardSchema = z.object({
  id: z.string().optional(),
  documentId: z.string().optional(),
  slug: z.string().min(1),
  type: z.literal("music"),
  title: z.string().min(1),
  originalTitle: z.string().nullable().optional(),
  artist: z.string().nullable(),
  label: z.string().nullable().optional(),
  releaseYear: z.number().int().nullable(),
  country: z.string().nullable(),
  duration: z.string().nullable(),
  durationSeconds: z.number().int().nullable(),
  releaseStatus: z.enum(RELEASE_STATUSES),
  shortDescription: z.string().nullable(),
  fullDescription: z.string().nullable().optional(),
  coverUrl: z.string().nullable(),
  curatorStatus: z.enum(CURATOR_STATUSES),
  musicKind: z.enum(MUSIC_KINDS),
  youtubeId: z.string().min(1),
  youtubeSourceUrl: z.string().url(),
  youtubeSubtitle: z.string().nullable(),
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

export const CreateMusicCardInputSchema = MusicCardSchema.omit({
  id: true,
  documentId: true,
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

export const StrapiMusicCardSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  slug: z.string().nullable().optional(),
  title: z.string(),
  originalTitle: z.string().nullable().optional(),
  type: z.enum(CARD_TYPES),
  releaseYear: z.number().nullable().optional(),
  country: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  durationSeconds: z.number().nullable().optional(),
  releaseStatus: z.enum(RELEASE_STATUSES).nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  fullDescription: z.unknown().nullable().optional(),
  artist: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  curatorStatus: z.enum(CURATOR_STATUSES).nullable().optional(),
  musicKind: z.enum(MUSIC_KINDS).nullable().optional(),
  youtubeId: z.string().nullable().optional(),
  youtubeSourceUrl: z.string().nullable().optional(),
  youtubeSubtitle: z.string().nullable().optional(),
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

export type YoutubeResolvedTrack = z.infer<typeof YoutubeResolvedTrackSchema>;
export type YoutubeResolvedData = z.infer<typeof YoutubeResolvedDataSchema>;
export type StrapiMusicCard = z.infer<typeof StrapiMusicCardSchema>;

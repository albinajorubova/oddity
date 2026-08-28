import { z } from "zod";

export const YoutubeResolvedTrackSchema = z.object({
  id: z.string().nullable(),
  title: z.string().nullable(),
  duration: z.string().nullable(),
  artists: z.array(z.string()).nullable(),
});

export const YoutubeResolvedDataSchema = z.object({
  kind: z.enum(["song", "album", "playlist"]),
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

export const ArchiveLinkEntrySchema = z.object({
  url: z.string().url(),
  savedAt: z.string().min(1),
  data: YoutubeResolvedDataSchema,
});

export const ResolveYoutubeRequestSchema = z.object({
  url: z.string().trim().min(1, "URL is required").url("Invalid URL"),
});

export const ResolveYoutubeSuccessSchema = z.object({
  data: YoutubeResolvedDataSchema,
});

export const ResolveYoutubeErrorSchema = z.object({
  error: z.string().min(1),
});

export type YoutubeResolvedTrack = z.infer<typeof YoutubeResolvedTrackSchema>;
export type YoutubeResolvedData = z.infer<typeof YoutubeResolvedDataSchema>;
export type ArchiveLinkEntry = z.infer<typeof ArchiveLinkEntrySchema>;
export type ResolveYoutubeRequest = z.infer<typeof ResolveYoutubeRequestSchema>;

import { z } from "zod";

import { YoutubeResolvedDataSchema } from "@entities/card";

export type {
  YoutubeResolvedData,
  YoutubeResolvedTrack,
} from "@entities/card";
export {
  YoutubeResolvedDataSchema,
  YoutubeResolvedTrackSchema,
} from "@entities/card";

export const CreateCardRequestSchema = z.object({
  url: z.string().trim().min(1, "URL is required").url("Invalid URL"),
});

export const UpdatePublishStatusSchema = z.object({
  id: z.string().trim().min(1, "Card id is required"),
  publishStatus: z.enum(["draft", "public"]),
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

export type ResolveYoutubeRequest = z.infer<typeof ResolveYoutubeRequestSchema>;

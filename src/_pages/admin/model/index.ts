export {
  useArchiveLinksActions,
  useArchiveLinksStore,
} from "./archive-links-store";
export type { FetchYoutubeResolveResult } from "./fetch-youtube-resolve";
export { fetchYoutubeResolve } from "./fetch-youtube-resolve";
export type {
  ArchiveLinkEntry,
  ResolveYoutubeRequest,
  YoutubeResolvedData,
  YoutubeResolvedTrack,
} from "./schemas";
export {
  ArchiveLinkEntrySchema,
  ResolveYoutubeErrorSchema,
  ResolveYoutubeRequestSchema,
  ResolveYoutubeSuccessSchema,
  YoutubeResolvedDataSchema,
  YoutubeResolvedTrackSchema,
} from "./schemas";
export { ADMIN_PROFILE_STUB } from "./stubs";
export type {
  AdminCard,
  AdminCardType,
  AdminFilter,
  AdminProfile,
  PublishStatus,
} from "./types";

export const ADMIN_FILTERS = ["all", "draft", "public"] as const;

export const formatCardMeta = (card: {
  type: string;
  year: number;
  country: string;
}) =>
  `${card.type.toUpperCase()} · ${card.year} · ${card.country.toUpperCase()}`;

export const formatPublishStatus = (status: "draft" | "public") =>
  status.toUpperCase();

export const countByStatus = (
  cards: { publishStatus: "draft" | "public" }[],
) => {
  let draft = 0;
  let published = 0;

  for (const card of cards) {
    if (card.publishStatus === "draft") draft += 1;
    else published += 1;
  }

  return { draft, published };
};

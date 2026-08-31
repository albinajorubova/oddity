export {
  useAdminCardsActions,
  useAdminCardsStore,
} from "./admin-cards-store";
export type { FetchCreateCardResult } from "./fetch-create-card";
export { fetchCreateCardFromUrl } from "./fetch-create-card";
export type { FetchYoutubeResolveResult } from "./fetch-youtube-resolve";
export { fetchYoutubeResolve } from "./fetch-youtube-resolve";
export { mapMusicItemToAdminCard } from "./map-music-item-to-admin-card";
export type {
  ResolveYoutubeRequest,
  YoutubeResolvedData,
  YoutubeResolvedTrack,
} from "./schemas";
export {
  CreateCardRequestSchema,
  ResolveYoutubeErrorSchema,
  ResolveYoutubeRequestSchema,
  ResolveYoutubeSuccessSchema,
  YoutubeResolvedDataSchema,
  YoutubeResolvedTrackSchema,
} from "./schemas";
export { ADMIN_PROFILE_STUB } from "./stubs";
export type {
  AdminCard,
  AdminFilter,
  AdminProfile,
  PublishStatus,
} from "./types";

export const ADMIN_FILTERS = ["all", "draft", "public"] as const;

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

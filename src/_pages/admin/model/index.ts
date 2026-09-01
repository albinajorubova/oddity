export {
  useAdminCardsActions,
  useAdminCardsStore,
} from "./admin-cards-store";
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
  UpdatePublishStatusSchema,
  YoutubeResolvedDataSchema,
  YoutubeResolvedTrackSchema,
} from "./schemas";
export type {
  AdminCard,
  AdminFilter,
  AdminProfile,
  PublishStatus,
} from "./types";

export const ADMIN_FILTERS = ["all", "draft", "public"] as const;

export const ADMIN_PROFILE = {
  role: "CURATOR",
  established: "2026",
} as const;

export const formatPublishStatus = (status: "draft" | "public") =>
  status.toUpperCase();

export const countByStatus = (
  cards: { publishStatus: "draft" | "public" }[],
) => {
  const draft = cards.filter((card) => card.publishStatus === "draft").length;
  return { draft, published: cards.length - draft };
};

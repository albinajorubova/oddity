import type {
  AvailabilityLink,
  CreateMusicItemInput,
  MusicItemTypeSlug,
  YoutubeImportData,
  YoutubeImportKind,
} from "../model";
import { stripNullish } from "./sanitize-strapi-payload";
import {
  formatDurationSeconds,
  slugFromYoutube,
  sumTracklistDuration,
} from "./youtube-utils";

const YOUTUBE_KIND_TO_ITEM_TYPE: Record<YoutubeImportKind, MusicItemTypeSlug> = {
  song: "track",
  album: "album",
  playlist: "playlist",
};

const parseReleaseDate = (year: string | null): string | null => {
  if (!year) return null;
  const parsed = Number.parseInt(year, 10);
  if (!Number.isFinite(parsed)) return null;
  return `${parsed}-01-01`;
};

const availabilityLabelFromUrl = (url: string): string => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "music.youtube.com") return "YouTube Music";
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be"
    ) {
      return "YouTube";
    }
  } catch {
    // ignore invalid URL
  }

  return "YouTube Music";
};

const mapTracks = (
  tracks: YoutubeImportData["tracks"],
): CreateMusicItemInput["tracks"] => {
  if (!tracks?.length) return null;

  return tracks.map((track) => ({
    youtubeId: track.id,
    title: track.title,
    duration: track.duration,
    artists: track.artists,
  }));
};

export const resolveItemTypeSlug = (
  kind: YoutubeImportKind,
): MusicItemTypeSlug => YOUTUBE_KIND_TO_ITEM_TYPE[kind];

export const mapYoutubeToMusicItem = (
  data: YoutubeImportData,
  itemTypeDocumentId: string,
): CreateMusicItemInput => {
  const tracks = mapTracks(data.tracks);
  const duration =
    data.kind === "song"
      ? formatDurationSeconds(data.duration)
      : sumTracklistDuration(tracks);

  return {
    slug: slugFromYoutube(data.title, data.id),
    title: data.title?.trim() || "Untitled",
    itemTypeSlug: resolveItemTypeSlug(data.kind),
    itemTypeId: itemTypeDocumentId,
    itemTypeDocumentId,
    description: data.description,
    releaseDate: parseReleaseDate(data.year),
    coverUrl: data.thumbnail,
    duration,
    curatorStatus: "draft",
    youtubeId: data.id,
    youtubeSourceUrl: data.sourceUrl,
    tracks,
    availability: [
      {
        label: availabilityLabelFromUrl(data.sourceUrl),
        href: data.sourceUrl,
      },
    ],
    people: [],
  };
};

const mapAvailabilityLinks = (availability: AvailabilityLink[]) =>
  availability.map((item) => ({
    text: item.label,
    url: item.href,
    target_blank: true,
  }));

export const mapMusicItemToStrapiPayload = (item: CreateMusicItemInput) => {
  const tracks =
    item.tracks?.map((track) =>
      stripNullish({
        youtubeId: track.youtubeId,
        title: track.title,
        duration: track.duration,
        artists: track.artists,
      }),
    ) ?? [];

  const people = item.people.flatMap((ref) => {
    const documentId = ref.person?.documentId;
    if (!documentId) return [];
    return [{ person: documentId }];
  });

  return stripNullish({
    title: item.title,
    slug: item.slug,
    itemType: item.itemTypeDocumentId,
    description: item.description,
    releaseDate: item.releaseDate,
    coverUrl: item.coverUrl,
    duration: item.duration,
    curatorStatus: item.curatorStatus,
    youtubeId: item.youtubeId,
    youtubeSourceUrl: item.youtubeSourceUrl,
    tracks,
    availability: mapAvailabilityLinks(item.availability),
    ...(people.length ? { people } : {}),
  });
};

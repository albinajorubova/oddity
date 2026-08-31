import type { AvailabilityLink, CreateMusicCardInput } from "../model";
import type { YoutubeResolvedData } from "../model/schemas";
import { formatDurationSeconds, sumTracklistDuration } from "./format-duration";
import { stripNullish } from "./sanitize-strapi-payload";
import { slugFromYoutube } from "./slug-from-youtube";

const parseReleaseYear = (value: string | null): number | null => {
  if (!value) return null;
  const year = Number.parseInt(value, 10);
  return Number.isFinite(year) ? year : null;
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
  tracks: YoutubeResolvedData["tracks"],
): CreateMusicCardInput["tracks"] => {
  if (!tracks?.length) return null;

  return tracks.map((track) => ({
    youtubeId: track.id,
    title: track.title,
    duration: track.duration,
    artists: track.artists,
  }));
};

export const mapYoutubeToMusicCard = (
  data: YoutubeResolvedData,
): CreateMusicCardInput => {
  const tracks = mapTracks(data.tracks);
  const durationSeconds = data.duration;
  const duration =
    data.kind === "song"
      ? formatDurationSeconds(durationSeconds)
      : sumTracklistDuration(tracks);

  return {
    slug: slugFromYoutube(data.title, data.id),
    type: "music",
    title: data.title?.trim() || "Untitled",
    originalTitle: null,
    artist: data.artist,
    label: null,
    releaseYear: parseReleaseYear(data.year),
    country: null,
    duration,
    durationSeconds,
    releaseStatus: "Released",
    shortDescription: data.description ?? data.subtitle,
    fullDescription: data.description,
    coverUrl: data.thumbnail,
    curatorStatus: "draft",
    musicKind: data.kind,
    youtubeId: data.id,
    youtubeSourceUrl: data.sourceUrl,
    youtubeSubtitle: data.subtitle,
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

export const mapMusicCardToAvailabilityLinks = (
  availability: AvailabilityLink[],
) =>
  availability.map((item) => ({
    text: item.label,
    url: item.href,
    target_blank: true,
  }));

export const mapMusicCardToStrapiPayload = (card: CreateMusicCardInput) => {
  const tracks =
    card.tracks?.map((track) =>
      stripNullish({
        youtubeId: track.youtubeId,
        title: track.title,
        duration: track.duration,
        artists: track.artists,
      }),
    ) ?? [];

  const people = card.people.flatMap((ref) => {
    const documentId = ref.person?.documentId;
    if (!documentId) return [];
    return [{ person: documentId }];
  });

  return stripNullish({
    title: card.title,
    slug: card.slug,
    originalTitle: card.originalTitle,
    type: card.type,
    releaseYear: card.releaseYear,
    country: card.country,
    duration: card.duration,
    durationSeconds: card.durationSeconds,
    releaseStatus: card.releaseStatus,
    shortDescription: card.shortDescription,
    fullDescription: card.fullDescription,
    artist: card.artist,
    label: card.label,
    coverUrl: card.coverUrl,
    curatorStatus: card.curatorStatus,
    musicKind: card.musicKind,
    youtubeId: card.youtubeId,
    youtubeSourceUrl: card.youtubeSourceUrl,
    youtubeSubtitle: card.youtubeSubtitle,
    tracks,
    availability: mapMusicCardToAvailabilityLinks(card.availability),
    ...(people.length ? { people } : {}),
  });
};

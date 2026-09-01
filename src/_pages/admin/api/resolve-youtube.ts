import { Innertube } from "youtubei.js";

import {
  type YoutubeResolvedData,
  YoutubeResolvedDataSchema,
  type YoutubeResolvedTrack,
} from "@entities/card";

export type ResolveYoutubeResult =
  | { ok: true; data: YoutubeResolvedData }
  | { ok: false; error: string };

type ParsedTarget =
  | { kind: "song"; id: string }
  | { kind: "album"; id: string }
  | { kind: "playlist"; id: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

const textOf = (value: unknown): string | null => {
  if (value == null) return null;
  if (typeof value === "string") return value || null;
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && "text" in value) {
    const text = (value as { text?: unknown }).text;
    return typeof text === "string" && text ? text : null;
  }
  return null;
};

const pickThumbnail = (
  thumbs: Array<{ url?: string; width?: number }> | undefined | null,
): string | null => {
  if (!thumbs?.length) return null;
  const sorted = [...thumbs].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? null;
};

const parseYoutubeUrl = (input: string): ParsedTarget | null => {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  if (!YOUTUBE_HOSTS.has(host)) return null;

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? { kind: "song", id } : null;
  }

  const videoId = url.searchParams.get("v");
  if (videoId) return { kind: "song", id: videoId };

  const listId = url.searchParams.get("list");
  if (listId) return { kind: "playlist", id: listId };

  const browseMatch = url.pathname.match(
    /\/browse\/((?:MPREb_|FEmusic_)[\w-]+)/,
  );
  if (browseMatch?.[1]) return { kind: "album", id: browseMatch[1] };

  return null;
};

const mapTrack = (item: {
  id?: string;
  title?: string;
  duration?: { text?: string } | string;
  artists?: Array<{ name?: string }>;
}): YoutubeResolvedTrack => ({
  id: item.id ?? null,
  title: item.title ?? null,
  duration:
    typeof item.duration === "string"
      ? item.duration
      : (item.duration?.text ?? null),
  artists:
    item.artists
      ?.map((artist) => artist.name)
      .filter((name): name is string => Boolean(name)) ?? null,
});

const toResolvedData = (value: YoutubeResolvedData): ResolveYoutubeResult => {
  const parsed = YoutubeResolvedDataSchema.safeParse(value);
  if (!parsed.success) {
    return { ok: false, error: "Invalid YouTube payload shape" };
  }
  return { ok: true, data: parsed.data };
};

const resolveSong = async (
  yt: Innertube,
  id: string,
  sourceUrl: string,
): Promise<YoutubeResolvedData> => {
  const info = await yt.music.getInfo(id);
  const basic = info.basic_info;

  return {
    kind: "song",
    id,
    title: basic?.title ?? null,
    artist: basic?.author ?? null,
    subtitle: null,
    description: null,
    thumbnail: pickThumbnail(basic?.thumbnail),
    duration: basic?.duration ?? null,
    year: null,
    tracks: null,
    sourceUrl,
  };
};

const resolveAlbum = async (
  yt: Innertube,
  id: string,
  sourceUrl: string,
): Promise<YoutubeResolvedData> => {
  const album = await yt.music.getAlbum(id);
  const header = album.header as
    | {
        title?: unknown;
        subtitle?: unknown;
        strapline_text_one?: unknown;
        thumbnail?: { contents?: Array<{ url?: string; width?: number }> };
        description?: { description?: unknown };
      }
    | undefined;

  const tracks = album.contents?.map((item) => mapTrack(item)) ?? null;
  const yearMatch = textOf(header?.subtitle)?.match(/\b(19|20)\d{2}\b/);

  return {
    kind: "album",
    id,
    title: textOf(header?.title),
    artist: textOf(header?.strapline_text_one),
    subtitle: textOf(header?.subtitle),
    description: textOf(header?.description?.description),
    thumbnail: pickThumbnail(header?.thumbnail?.contents),
    duration: null,
    year: yearMatch?.[0] ?? null,
    tracks,
    sourceUrl,
  };
};

const resolvePlaylist = async (
  yt: Innertube,
  id: string,
  sourceUrl: string,
): Promise<YoutubeResolvedData> => {
  const playlist = await yt.music.getPlaylist(id);
  const items = [...playlist.items].flatMap((item) => {
    if (!("title" in item) || typeof item.title !== "string") return [];
    return [
      {
        id: item.id,
        title: item.title,
        duration: item.duration,
        artists: item.artists,
        album: item.album,
        thumbnail: item.thumbnail,
      },
    ];
  });
  const first = items[0];

  const albumId = first?.album?.id;
  if (albumId?.startsWith("MPREb_")) {
    return resolveAlbum(yt, albumId, sourceUrl);
  }

  const header = playlist.header as
    | { title?: unknown; subtitle?: unknown; author?: { name?: string } }
    | undefined;

  return {
    kind: "playlist",
    id,
    title: textOf(header?.title) ?? id,
    artist: header?.author?.name ?? first?.artists?.[0]?.name ?? null,
    subtitle: textOf(header?.subtitle),
    description: null,
    thumbnail: pickThumbnail(first?.thumbnail?.contents),
    duration: null,
    year: null,
    tracks: items.map((item) => mapTrack(item)),
    sourceUrl,
  };
};

const RESOLVERS = {
  song: resolveSong,
  album: resolveAlbum,
  playlist: resolvePlaylist,
} as const;

export const resolveYoutubeUrl = async (
  url: string,
): Promise<ResolveYoutubeResult> => {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "Empty URL" };

  const target = parseYoutubeUrl(trimmed);
  if (!target) {
    return {
      ok: false,
      error: "Only YouTube / YouTube Music links are supported for now",
    };
  }

  try {
    const yt = await Innertube.create({ retrieve_player: false });

    const data = await RESOLVERS[target.kind](yt, target.id, trimmed);

    return toResolvedData(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to resolve YouTube URL";
    return { ok: false, error: message };
  }
};

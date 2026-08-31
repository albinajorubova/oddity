import type { YoutubeResolvedTrack } from "@entities/card/model/schemas";

const splitArtistString = (value: string): string[] =>
  value
    .split(/[,;&/]|(?:\s+feat\.?\s+)|(?:\s+ft\.?\s+)/i)
    .map((part) => part.trim())
    .filter(Boolean);

/** Collect unique artist names from YouTube metadata. */
export const parseArtistNames = (
  artist: string | null,
  tracks?: YoutubeResolvedTrack[] | null,
): string[] => {
  const names = new Set<string>();

  if (artist?.trim()) {
    for (const part of splitArtistString(artist)) {
      names.add(part);
    }
  }

  for (const track of tracks ?? []) {
    for (const name of track.artists ?? []) {
      if (name.trim()) names.add(name.trim());
    }
  }

  return [...names];
};

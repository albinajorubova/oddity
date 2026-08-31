import type { YoutubeResolvedData } from "@entities/card";
import {
  mapYoutubeToMusicItem,
  requireMusicItemTypeBySlug,
  resolveItemTypeSlug,
} from "@entities/music-library";
import {
  findOrCreatePersonByName,
  type PersonRef,
  parseArtistNames,
} from "@entities/person";

export const resolvePeopleFromYoutube = async (
  data: YoutubeResolvedData,
  options?: { status?: "draft" | "published" },
): Promise<PersonRef[]> => {
  const names = parseArtistNames(data.artist, data.tracks);
  if (!names.length) return [];

  const people = await Promise.all(
    names.map((name) => findOrCreatePersonByName(name, options)),
  );

  return people.flatMap((person) => {
    if (!person?.documentId) return [];
    return [{ person }];
  });
};

export const buildMusicItemInputFromYoutube = async (
  data: YoutubeResolvedData,
  options?: { status?: "draft" | "published" },
) => {
  const itemType = await requireMusicItemTypeBySlug(
    resolveItemTypeSlug(data.kind),
  );

  if (!itemType.documentId) {
    throw new Error(`Music item type "${itemType.slug}" has no documentId`);
  }

  return {
    ...mapYoutubeToMusicItem(data, itemType.documentId),
    people: await resolvePeopleFromYoutube(data, options),
  };
};

import type { PersonRef } from "@entities/person";

import type { MusicItem } from "../model";
import { type StrapiMusicItem, StrapiMusicItemSchema } from "../model/schemas";

const mapAvailability = (
  links: StrapiMusicItem["availability"],
): MusicItem["availability"] =>
  (links ?? []).flatMap((link) => {
    if (!link.text || !link.url) return [];
    return [{ label: link.text, href: link.url }];
  });

const mapTracks = (tracks: StrapiMusicItem["tracks"]): MusicItem["tracks"] => {
  if (!tracks?.length) return null;

  return tracks.map((track) => ({
    youtubeId: track.youtubeId ?? null,
    title: track.title ?? null,
    duration: track.duration ?? null,
    artists: track.artists ?? null,
  }));
};

const mapPeople = (people: StrapiMusicItem["people"]): PersonRef[] =>
  (people ?? []).flatMap((ref) => {
    const raw = ref.person;
    if (!raw || typeof raw !== "object" || !("name" in raw)) return [];

    const person = raw as {
      id?: number;
      documentId?: string;
      name: string;
      slug?: string | null;
      description?: string | null;
      imageUrl?: string | null;
    };

    return [
      {
        id: ref.id,
        person: {
          id: person.documentId ?? String(person.id ?? ""),
          documentId: person.documentId,
          name: person.name,
          slug: person.slug ?? null,
          description: person.description ?? null,
          imageUrl: person.imageUrl ?? null,
        },
      },
    ];
  });

const slugFallback = (title: string, youtubeId?: string | null): string => {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return youtubeId
    ? `${normalized || "music"}-${youtubeId.slice(0, 8)}`
    : normalized;
};

export const mapStrapiToMusicItem = (raw: unknown): MusicItem | null => {
  const parsed = StrapiMusicItemSchema.safeParse(raw);
  if (!parsed.success) return null;

  const item = parsed.data;
  const itemType = item.itemType;

  if (!itemType?.documentId || !itemType.slug) return null;

  return {
    id: item.id != null ? String(item.id) : undefined,
    documentId: item.documentId,
    slug: item.slug ?? slugFallback(item.title, item.youtubeId),
    title: item.title,
    itemTypeSlug: itemType.slug,
    itemTypeId: itemType.documentId,
    description: item.description ?? null,
    releaseDate: item.releaseDate ?? null,
    coverUrl: item.coverUrl ?? null,
    duration: item.duration ?? null,
    curatorStatus: item.curatorStatus ?? "draft",
    youtubeId: item.youtubeId ?? "",
    youtubeSourceUrl: item.youtubeSourceUrl ?? "",
    tracks: mapTracks(item.tracks),
    availability: mapAvailability(item.availability),
    people: mapPeople(item.people),
  };
};

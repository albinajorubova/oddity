import type { PersonRef } from "@entities/person";

import type { MusicCard } from "../model";
import { type StrapiMusicCard, StrapiMusicCardSchema } from "../model/schemas";

const mapAvailability = (
  links: StrapiMusicCard["availability"],
): MusicCard["availability"] =>
  (links ?? []).flatMap((link) => {
    if (!link.text || !link.url) return [];
    return [{ label: link.text, href: link.url }];
  });

const mapTracks = (tracks: StrapiMusicCard["tracks"]): MusicCard["tracks"] => {
  if (!tracks?.length) return null;

  return tracks.map((track) => ({
    youtubeId: track.youtubeId ?? null,
    title: track.title ?? null,
    duration: track.duration ?? null,
    artists: track.artists ?? null,
  }));
};

const mapPeople = (people: StrapiMusicCard["people"]): PersonRef[] =>
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

export const mapStrapiToMusicCard = (raw: unknown): MusicCard | null => {
  const parsed = StrapiMusicCardSchema.safeParse(raw);
  if (!parsed.success || parsed.data.type !== "music") return null;

  const item = parsed.data;

  return {
    id: item.id != null ? String(item.id) : undefined,
    documentId: item.documentId,
    slug: item.slug ?? slugFallback(item.title, item.youtubeId),
    type: "music",
    title: item.title,
    originalTitle: item.originalTitle ?? null,
    artist: item.artist ?? null,
    label: item.label ?? null,
    releaseYear: item.releaseYear ?? null,
    country: item.country ?? null,
    duration: item.duration ?? null,
    durationSeconds: item.durationSeconds ?? null,
    releaseStatus: item.releaseStatus ?? "Released",
    shortDescription: item.shortDescription ?? null,
    fullDescription:
      typeof item.fullDescription === "string" ? item.fullDescription : null,
    coverUrl: item.coverUrl ?? null,
    curatorStatus: item.curatorStatus ?? "draft",
    musicKind: item.musicKind ?? "song",
    youtubeId: item.youtubeId ?? "",
    youtubeSourceUrl: item.youtubeSourceUrl ?? "",
    youtubeSubtitle: item.youtubeSubtitle ?? null,
    tracks: mapTracks(item.tracks),
    availability: mapAvailability(item.availability),
    people: mapPeople(item.people),
  };
};

const slugFallback = (title: string, youtubeId?: string | null): string => {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return youtubeId
    ? `${normalized || "music"}-${youtubeId.slice(0, 8)}`
    : normalized;
};

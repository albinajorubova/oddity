import type { PersonRef } from "@entities/person";

import type { ArchiveCard } from "../model/archive-types";
import { type StrapiMusicCard, StrapiMusicCardSchema } from "../model/schemas";

const mapAvailability = (
  links: StrapiMusicCard["availability"],
): ArchiveCard["availability"] =>
  (links ?? []).flatMap((link) => {
    if (!link.text || !link.url) return [];
    return [{ label: link.text, href: link.url }];
  });

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

export const mapStrapiToArchiveCard = (raw: unknown): ArchiveCard | null => {
  const parsed = StrapiMusicCardSchema.safeParse(raw);
  if (!parsed.success || parsed.data.type === "music") return null;

  const item = parsed.data;

  return {
    id: item.id != null ? String(item.id) : undefined,
    documentId: item.documentId,
    slug: item.slug ?? item.title.toLowerCase().replace(/\s+/g, "-"),
    type: item.type as ArchiveCard["type"],
    title: item.title,
    releaseYear: item.releaseYear ?? null,
    country: item.country ?? null,
    duration: item.duration ?? null,
    releaseStatus: item.releaseStatus ?? "Released",
    shortDescription: item.shortDescription ?? null,
    coverUrl: item.coverUrl ?? null,
    curatorStatus: item.curatorStatus ?? "draft",
    availability: mapAvailability(item.availability),
    people: mapPeople(item.people),
  };
};

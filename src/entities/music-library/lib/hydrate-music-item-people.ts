import type { PersonRef } from "@entities/person";
import { getPersonByDocumentId } from "@entities/person";

import type { MusicItem } from "../model";

/** Fills person names when Strapi returns only documentId in people[]. */
export const hydrateMusicItemPeople = async (
  item: MusicItem,
  options?: { status?: "draft" | "published" },
): Promise<MusicItem> => {
  if (!item.people.length) return item;

  const people = await Promise.all(
    item.people.map(async (ref): Promise<PersonRef> => {
      if (ref.person?.name?.trim()) return ref;

      const documentId = ref.person?.documentId ?? ref.person?.id;
      if (!documentId) return ref;

      const person = await getPersonByDocumentId(documentId, options);
      if (!person) return ref;

      return { ...ref, person };
    }),
  );

  return { ...item, people };
};

export const hydrateMusicItemsPeople = async (
  items: MusicItem[],
  options?: { status?: "draft" | "published" },
): Promise<MusicItem[]> =>
  Promise.all(items.map((item) => hydrateMusicItemPeople(item, options)));

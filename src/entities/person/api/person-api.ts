import { strapiClient } from "@shared/api/strapi";

import { mapStrapiToPerson } from "../lib/map-strapi-person";
import { slugFromPersonName } from "../lib/slug-from-name";
import type { Person } from "../model/types";

export const STRAPI_PERSON_COLLECTION = "people" as const;

const people = () => strapiClient.collection(STRAPI_PERSON_COLLECTION);

const findPersonByName = async (
  name: string,
  status: "draft" | "published",
): Promise<Person | null> => {
  const response = await people().find({
    filters: { name: { $eqi: name } },
    pagination: { pageSize: 1 },
    status,
  });

  const first = response.data?.[0];
  return first ? mapStrapiToPerson(first) : null;
};

export const getPersonByName = async (name: string): Promise<Person | null> => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const draft = await findPersonByName(trimmed, "draft");
  if (draft) return draft;

  return findPersonByName(trimmed, "published");
};

export const createPerson = async (
  name: string,
  options?: { status?: "draft" | "published" },
): Promise<Person | null> => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const response = await people().create(
    {
      name: trimmed,
      slug: slugFromPersonName(trimmed),
    },
    {
      ...(options?.status ? { status: options.status } : {}),
    },
  );

  return mapStrapiToPerson(response.data);
};

export const findOrCreatePersonByName = async (
  name: string,
  options?: { status?: "draft" | "published" },
): Promise<Person | null> => {
  const existing = await getPersonByName(name);
  if (existing) return existing;

  try {
    return await createPerson(name, options);
  } catch {
    return getPersonByName(name);
  }
};

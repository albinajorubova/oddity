import { strapiClient } from "@shared/api/strapi";

import { slugFromPersonName } from "../lib/slug-from-name";
import type { Person } from "../model/types";
import {
  byDocId,
  byName,
  createOpts,
  STRAPI_PERSON_COLLECTION,
} from "./person-query";
import { personRebuild } from "./person-rebuild";

export { STRAPI_PERSON_COLLECTION };

const people = () => strapiClient.collection(STRAPI_PERSON_COLLECTION);

const findPersonByName = async (
  name: string,
  status: "draft" | "published",
): Promise<Person | null> => {
  const response = await people().find(byName(name, status));
  const first = response.data?.[0];

  return personRebuild(first);
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
    createOpts(options?.status),
  );

  return personRebuild(response.data);
};

export const getPersonByDocumentId = async (
  documentId: string,
  options?: { status?: "draft" | "published" },
): Promise<Person | null> => {
  const trimmed = documentId.trim();
  if (!trimmed) return null;

  const statuses: Array<"draft" | "published"> = options?.status
    ? [options.status]
    : ["draft", "published"];

  for (const status of statuses) {
    try {
      const response = await people().findOne(trimmed, byDocId(status));
      const mapped = personRebuild(response.data);
      if (mapped) return mapped;
    } catch {
      // try other publication status
    }
  }

  return null;
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

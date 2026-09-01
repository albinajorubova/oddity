import { mapStrapiToPerson } from "../lib/map-strapi-person";
import type { Person } from "../model/types";

export const personRebuild = (raw: unknown): Person | null =>
  mapStrapiToPerson(raw);

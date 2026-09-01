import { strapiClient } from "@shared/api/strapi";

import { cardError, cardLog } from "../lib/logger";
import { getErrorDetails } from "../lib/sanitize-strapi-payload";
import type { ArchiveCard } from "../model/archive-types";
import {
  cardBySlug,
  cards,
  STRAPI_CARD_COLLECTION,
} from "./archive-card-query";
import { cardRebuild, cardsRebuild } from "./archive-card-rebuild";

const collection = () => strapiClient.collection(STRAPI_CARD_COLLECTION);

export const getArchiveCards = async (
  options?: Parameters<typeof cards>[0],
): Promise<ArchiveCard[]> => {
  cardLog("getArchiveCards:start", options);

  try {
    const response = await collection().find(cards(options));
    const mapped = cardsRebuild(response.data ?? []);

    cardLog("getArchiveCards:success", { count: mapped.length });

    return mapped;
  } catch (error) {
    cardError("getArchiveCards:failed", getErrorDetails(error));
    throw error;
  }
};

export const getPublicArchiveCards = (): Promise<ArchiveCard[]> =>
  getArchiveCards({ status: "published", curatorStatus: "public" });

export const getArchiveCardBySlug = async (
  slug: string,
  options?: Parameters<typeof cardBySlug>[1],
): Promise<ArchiveCard | null> => {
  cardLog("getArchiveCardBySlug", { slug, ...options });

  try {
    const response = await collection().find(cardBySlug(slug, options));
    const first = response.data?.[0];
    const mapped = cardRebuild(first);

    cardLog("getArchiveCardBySlug:result", { slug, found: Boolean(mapped) });

    return mapped;
  } catch (error) {
    cardError("getArchiveCardBySlug:failed", {
      slug,
      error: getErrorDetails(error),
    });
    throw error;
  }
};

export const getPublicArchiveCardBySlug = (
  slug: string,
): Promise<ArchiveCard | null> =>
  getArchiveCardBySlug(slug, {
    status: "published",
    curatorStatus: "public",
  });

import { ROUTE_PATTERNS, ROUTES } from "@shared/config";

import type { AnimationType } from "../animations";

export type GetAnimationTypeParams = {
  prevRoute: string | null;
  nextRoute: string;
  slug?: string;
};

export function getAnimationType({
  prevRoute,
  nextRoute,
  slug,
}: GetAnimationTypeParams): AnimationType {
  const fromCollections = prevRoute === ROUTES.collections;
  const toCollections = nextRoute === ROUTES.collections;
  const fromDetail = prevRoute === ROUTE_PATTERNS.collectionDetail;
  const toDetail = nextRoute === ROUTE_PATTERNS.collectionDetail;

  if (fromCollections && toDetail && slug) {
    const card = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );
    const hero = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );
    if (card && hero) return "collections-to-detail";
  }

  if (fromDetail && toCollections && slug) {
    const card = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );
    const hero = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );
    if (card && hero) return "detail-to-collections";
  }

  return "fade";
}

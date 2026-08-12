/**
 * App pathnames — single source for links / router / transitions.
 */

export const ROUTES = {
  home: "/",
  collections: "/collections",
  stories: "/stories",
  about: "/about",
  search: "/search",
  login: "/login",
  join: "/join",
  labGallery: "/lab/gallery",
} as const;

/** Next.js Pages Router `router.route` patterns (dynamic segments). */
export const ROUTE_PATTERNS = {
  collectionDetail: "/collections/[slug]",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const collectionDetailPath = (slug: string) =>
  `${ROUTES.collections}/${slug}` as const;

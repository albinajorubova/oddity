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
  profile: "/profile",
  admin: "/admin",
  labGallery: "/lab/gallery",
} as const;

export const adminCardPath = (slug: string) =>
  `${ROUTES.admin}/cards/${slug}` as const;

/** Next.js Pages Router `router.route` patterns (dynamic segments). */
export const ROUTE_PATTERNS = {
  collectionDetail: "/collections/[slug]",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const collectionDetailPath = (slug: string) =>
  `${ROUTES.collections}/${slug}` as const;

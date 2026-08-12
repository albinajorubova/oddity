import { ROUTES } from "@shared/config";

export type HomeHeroStub = {
  brand: string;
  ctaLabel: string;
};

export type HomeNavItem = {
  label: string;
  href: string;
};

export const HOME_HERO_STUB: HomeHeroStub = {
  brand: "ODDITY",
  ctaLabel: "EXPLORE",
};

export const HOME_NAV_STUB: HomeNavItem[] = [
  { label: "COLLECTIONS", href: ROUTES.collections },
  { label: "STORIES", href: ROUTES.stories },
  { label: "ABOUT", href: ROUTES.about },
];

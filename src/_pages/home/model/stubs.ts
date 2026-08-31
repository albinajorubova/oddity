import { ROUTES } from "@shared/config";

export type HomeHeroStub = {
  brand: string;
  ctaLabel: string;
};

export type HomeNavItem = {
  label: string;
  href: string;
};

export type HomeOrbitItem = {
  id: string;
  src: string;
  alt: string;
  expand?: boolean;
};

export type HomeExpandStub = {
  eyebrow: string;
  title: string;
  text: string;
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

export const HOME_EXPAND_STUB: HomeExpandStub = {
  eyebrow: "Featured",
  title: "COLLECTIONS",
  text: "Archive cuts, covers, and scenes — one room at a time.",
};

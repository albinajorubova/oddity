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

/** 6 photos — позиции и maxW/maxH в orbit-gallery.module.scss */
export const HOME_ORBIT_STUB: HomeOrbitItem[] = [
  {
    id: "1",
    src: "/images/covers/sgt-pepper.jpg",
    alt: "Sgt. Pepper",
  },
  {
    id: "2",
    src: "/images/covers/crimson-king.jpg",
    alt: "Crimson King",
  },
  {
    id: "3",
    src: "/images/covers/aladdin-sane.jpg",
    alt: "Aladdin Sane",
  },
  {
    id: "4",
    src: "/images/covers/dark-side-of-the-moon.jpg",
    alt: "Dark Side of the Moon",
  },
  {
    id: "5",
    src: "/images/covers/kind-of-blue.jpg",
    alt: "Kind of Blue",
  },
  {
    id: "6",
    src: "/images/covers/nevermind.jpg",
    alt: "Nevermind",
    expand: true,
  },
];

export const HOME_EXPAND_STUB: HomeExpandStub = {
  eyebrow: "Featured",
  title: "COLLECTIONS",
  text: "Archive cuts, covers, and scenes — one room at a time.",
};

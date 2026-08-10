import type {
  ArchiveGalleryImage,
  ArchiveItem,
  ArchiveItemAspect,
} from "@entities/archive-card";

export type HomeHeroStub = {
  brand: string;
  est: string;
  description: string;
  ctaLabel: string;
};

export type HomeNavItem = {
  label: string;
  href: string;
};

export const HOME_HERO_STUB: HomeHeroStub = {
  brand: "ODDITY",
  est: "EST. 2026 / DIGITAL ARCHIVE",
  description: "A CURATED ARCHIVE OF EXTRAORDINARY ALBUMS.",
  ctaLabel: "EXPLORE",
};

export const HOME_NAV_STUB: HomeNavItem[] = [
  { label: "ARCHIVE", href: "/archive" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "STORIES", href: "/stories" },
  { label: "ABOUT", href: "/about" },
];

const gallery = (
  slug: string,
  items: ReadonlyArray<{ w: number; h: number; aspect: ArchiveItemAspect }>,
): ArchiveGalleryImage[] =>
  items.map(({ w, h, aspect }, index) => ({
    url: `https://picsum.photos/seed/oddity-${slug}-g${index + 1}/${w}/${h}`,
    aspect,
  }));

/** Stub gallery — albums only (slugs match archive detail stubs). */
export const ARCHIVE_ITEMS_STUB: ArchiveItem[] = [
  {
    id: "1",
    slug: "sgt-peppers-lonely-hearts-club-band",
    artist: "The Beatles",
    title: "Sgt. Pepper's Lonely Hearts Club Band",
    year: 1967,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-beatles/800/800",
    aspect: "square",
    galleryImages: gallery("beatles", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 900, h: 600, aspect: "landscape" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
  },
  {
    id: "2",
    slug: "in-the-court-of-the-crimson-king",
    artist: "King Crimson",
    title: "In the Court of the Crimson King",
    year: 1969,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-crimson/800/800",
    aspect: "square",
    galleryImages: gallery("crimson", [
      { w: 600, h: 900, aspect: "portrait" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
  },
  {
    id: "3",
    slug: "aladdin-sane",
    artist: "David Bowie",
    title: "Aladdin Sane",
    year: 1973,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-bowie/700/900",
    aspect: "portrait",
    galleryImages: gallery("bowie", [
      { w: 1000, h: 560, aspect: "wide" },
      { w: 800, h: 800, aspect: "square" },
    ]),
  },
  {
    id: "4",
    slug: "the-dark-side-of-the-moon",
    artist: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: 1973,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-floyd/1000/560",
    aspect: "wide",
    galleryImages: gallery("floyd", [
      { w: 800, h: 800, aspect: "square" },
      { w: 700, h: 900, aspect: "portrait" },
    ]),
  },
  {
    id: "5",
    slug: "kind-of-blue",
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-miles/800/800",
    aspect: "square",
    galleryImages: gallery("miles", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 1000, h: 560, aspect: "wide" },
    ]),
  },
  {
    id: "6",
    slug: "nevermind",
    artist: "Nirvana",
    title: "Nevermind",
    year: 1991,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-nirvana/700/900",
    aspect: "portrait",
    galleryImages: gallery("nirvana", [
      { w: 1000, h: 560, aspect: "wide" },
      { w: 600, h: 1000, aspect: "tall" },
      { w: 800, h: 800, aspect: "square" },
    ]),
  },
];

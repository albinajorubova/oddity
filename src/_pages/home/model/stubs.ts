import type { ArchiveItem } from "@entities/archive-card";

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
  description: "A CURATED ARCHIVE OF EXTRAORDINARY CULTURAL ARTIFACTS.",
  ctaLabel: "EXPLORE",
};

export const HOME_NAV_STUB: HomeNavItem[] = [
  { label: "ARCHIVE", href: "/archive" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "STORIES", href: "/stories" },
  { label: "ABOUT", href: "/about" },
];

/** Stub gallery items for homepage masonry. Images: picsum seeded placeholders. */
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
  },
  {
    id: "2",
    slug: "lolita",
    artist: "Stanley Kubrick",
    title: "Lolita",
    year: 1962,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-lolita/600/900",
    aspect: "portrait",
  },
  {
    id: "3",
    slug: "2001-a-space-odyssey",
    artist: "Stanley Kubrick",
    title: "2001: A Space Odyssey",
    year: 1968,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-2001/700/1000",
    aspect: "portrait",
  },
  {
    id: "4",
    slug: "in-the-court-of-the-crimson-king",
    artist: "King Crimson",
    title: "In the Court of the Crimson King",
    year: 1969,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-crimson/800/800",
    aspect: "square",
  },
  {
    id: "5",
    slug: "akira",
    artist: "Katsuhiro Otomo",
    title: "Akira",
    year: 1988,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-akira/600/1000",
    aspect: "tall",
  },
  {
    id: "6",
    slug: "aladdin-sane",
    artist: "David Bowie",
    title: "Aladdin Sane",
    year: 1973,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-bowie/700/900",
    aspect: "portrait",
  },
  {
    id: "7",
    slug: "mad-men",
    artist: "Matthew Weiner",
    title: "Mad Men",
    year: 2007,
    category: "TV",
    imageUrl: "https://picsum.photos/seed/oddity-madmen/900/600",
    aspect: "landscape",
  },
  {
    id: "8",
    slug: "marilyn-monroe",
    artist: "Andy Warhol",
    title: "Marilyn Monroe",
    year: 1967,
    category: "Art",
    imageUrl: "https://picsum.photos/seed/oddity-marilyn/800/800",
    aspect: "square",
  },
  {
    id: "9",
    slug: "do-the-right-thing",
    artist: "Spike Lee",
    title: "Do the Right Thing",
    year: 1989,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-spike/650/900",
    aspect: "portrait",
  },
  {
    id: "10",
    slug: "the-dark-side-of-the-moon",
    artist: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: 1973,
    category: "Music",
    imageUrl: "https://picsum.photos/seed/oddity-floyd/1000/560",
    aspect: "wide",
  },
];

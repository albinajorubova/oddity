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
  description: "A CURATED ARCHIVE OF EXTRAORDINARY CULTURAL ARTIFACTS.",
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
    galleryImages: gallery("beatles", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 900, h: 600, aspect: "landscape" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
  },
  {
    id: "2",
    slug: "mulholland-drive",
    artist: "David Lynch",
    title: "Mulholland Drive",
    year: 2001,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-mulholland/600/900",
    aspect: "portrait",
    galleryImages: gallery("mulholland", [
      { w: 800, h: 800, aspect: "square" },
      { w: 1000, h: 560, aspect: "wide" },
    ]),
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
    galleryImages: gallery("2001", [
      { w: 900, h: 600, aspect: "landscape" },
      { w: 700, h: 900, aspect: "portrait" },
      { w: 800, h: 800, aspect: "square" },
    ]),
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
    galleryImages: gallery("crimson", [
      { w: 600, h: 900, aspect: "portrait" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
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
    galleryImages: gallery("akira", [
      { w: 800, h: 800, aspect: "square" },
      { w: 900, h: 600, aspect: "landscape" },
      { w: 700, h: 900, aspect: "portrait" },
    ]),
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
    galleryImages: gallery("bowie", [
      { w: 1000, h: 560, aspect: "wide" },
      { w: 800, h: 800, aspect: "square" },
    ]),
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
    galleryImages: gallery("madmen", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
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
    galleryImages: gallery("marilyn", [
      { w: 600, h: 900, aspect: "portrait" },
      { w: 900, h: 600, aspect: "landscape" },
      { w: 1000, h: 560, aspect: "wide" },
    ]),
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
    galleryImages: gallery("spike", [
      { w: 800, h: 800, aspect: "square" },
      { w: 900, h: 600, aspect: "landscape" },
    ]),
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
    galleryImages: gallery("floyd", [
      { w: 800, h: 800, aspect: "square" },
      { w: 700, h: 900, aspect: "portrait" },
    ]),
  },
  {
    id: "11",
    slug: "blade-runner",
    artist: "Ridley Scott",
    title: "Blade Runner",
    year: 1982,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-blade/700/1000",
    aspect: "portrait",
    galleryImages: gallery("blade", [
      { w: 900, h: 600, aspect: "landscape" },
      { w: 600, h: 1000, aspect: "tall" },
    ]),
  },
  {
    id: "12",
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
    id: "13",
    slug: "twin-peaks",
    artist: "David Lynch",
    title: "Twin Peaks",
    year: 1990,
    category: "TV",
    imageUrl: "https://picsum.photos/seed/oddity-twinpeaks/600/1000",
    aspect: "tall",
    galleryImages: gallery("twinpeaks", [
      { w: 800, h: 800, aspect: "square" },
      { w: 900, h: 600, aspect: "landscape" },
    ]),
  },
  {
    id: "14",
    slug: "campbells-soup",
    artist: "Andy Warhol",
    title: "Campbell's Soup Cans",
    year: 1962,
    category: "Art",
    imageUrl: "https://picsum.photos/seed/oddity-soup/900/600",
    aspect: "landscape",
    galleryImages: gallery("soup", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 800, h: 800, aspect: "square" },
    ]),
  },
  {
    id: "15",
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
  {
    id: "16",
    slug: "parasite",
    artist: "Bong Joon-ho",
    title: "Parasite",
    year: 2019,
    category: "Movies",
    imageUrl: "https://picsum.photos/seed/oddity-parasite/1000/560",
    aspect: "wide",
    galleryImages: gallery("parasite", [
      { w: 700, h: 900, aspect: "portrait" },
      { w: 900, h: 600, aspect: "landscape" },
    ]),
  },
  {
    id: "17",
    slug: "the-sopranos",
    artist: "David Chase",
    title: "The Sopranos",
    year: 1999,
    category: "TV",
    imageUrl: "https://picsum.photos/seed/oddity-sopranos/800/800",
    aspect: "square",
    galleryImages: gallery("sopranos", [
      { w: 600, h: 1000, aspect: "tall" },
      { w: 700, h: 900, aspect: "portrait" },
    ]),
  },
  {
    id: "18",
    slug: "guernica",
    artist: "Pablo Picasso",
    title: "Guernica",
    year: 1937,
    category: "Art",
    imageUrl: "https://picsum.photos/seed/oddity-guernica/600/1000",
    aspect: "tall",
    galleryImages: gallery("guernica", [
      { w: 900, h: 600, aspect: "landscape" },
      { w: 800, h: 800, aspect: "square" },
      { w: 1000, h: 560, aspect: "wide" },
    ]),
  },
];

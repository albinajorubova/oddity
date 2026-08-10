import type { ArchiveDetail } from "./types";

const GALLERY_POOL = [
  "/images/images.webp",
  "/images/card1.png",
  "/images/card2.png",
  "/images/Generated_image.png",
  "/images/Generated_image-2.png",
  "/images/search.png",
  "/images/graph.png",
] as const;

const slides = (slug: string, count: number): ArchiveDetail["gallery"] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${slug}-${index + 1}`,
    url: GALLERY_POOL[index % GALLERY_POOL.length],
    alt: `${slug} frame ${index + 1}`,
  }));

export const ARCHIVE_DETAIL_STUBS: ArchiveDetail[] = [
  {
    id: "mulholland-drive",
    slug: "mulholland-drive",
    title: "Mulholland Drive",
    originalTitle: "Mulholland Dr.",
    type: "Movie",
    year: 2001,
    country: "USA",
    runtime: "147 min",
    status: "Restored",
    shortDescription: [
      "An aspiring actress meets a woman with amnesia along Mulholland Drive in this dreamlike neo-noir—where Hollywood fantasy and identity blur beyond recognition.",
      "What begins as a mystery becomes a fever dream of ambition, desire, and the dark underside of the Hollywood dream factory.",
    ],
    editorNote:
      "A hallucinatory exploration of identity, ambition and the Hollywood dream—Lynch at his most elliptical and hypnotic.",
    director: "David Lynch",
    availability: [
      { label: "Oddity Library", href: "#" },
      { label: "Oddity Screening Room", href: "#" },
      { label: "Oddity Research", href: "#" },
    ],
    gallery: slides("mulholland", 12),
  },
  {
    id: "3",
    slug: "2001-a-space-odyssey",
    title: "2001: A Space Odyssey",
    originalTitle: "2001: A Space Odyssey",
    type: "Movie",
    year: 1968,
    country: "UK / USA",
    runtime: "149 min",
    status: "Released",
    shortDescription:
      "A voyage from prehistoric dawn to the far reaches of space—an enigmatic meditation on evolution, technology and the unknown.",
    editorNote: "Give it your full attention. Best experienced alone.",
    director: "Stanley Kubrick",
    availability: [
      { label: "Oddity Library", href: "#" },
      { label: "Blu-ray", href: "#" },
    ],
    gallery: slides("2001", 10),
  },
];

export const getArchiveDetailBySlug = (
  slug: string,
): ArchiveDetail | undefined =>
  ARCHIVE_DETAIL_STUBS.find((item) => item.slug === slug);

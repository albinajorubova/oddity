export type ArchiveContentType =
  | "Movie"
  | "Series"
  | "Anime"
  | "Music"
  | "Book"
  | "Game";

export type ArchiveStatus = "Released" | "Ongoing" | "Upcoming" | "Restored";

export type ArchiveAvailabilityLink = {
  label: string;
  href: string;
};

export type ArchiveGallerySlide = {
  id: string;
  url: string;
  alt: string;
};

/** Core fields needed for detail hero (from content model). */
export type ArchiveDetail = {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  type: ArchiveContentType;
  year: number;
  country: string;
  runtime?: string;
  status: ArchiveStatus;
  /** One or more body paragraphs for the hero. */
  shortDescription: string | string[];
  editorNote?: string;
  director?: string;
  availability: ArchiveAvailabilityLink[];
  gallery: ArchiveGallerySlide[];
};

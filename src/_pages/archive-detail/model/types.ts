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

export type ArchiveCharacteristics = {
  oddity: string[];
  meme: string[];
};

export type ArchiveCategories = {
  genres?: string[];
  themes?: string[];
  atmosphere?: string[];
  mood?: string[];
  tags?: string[];
};

export type ArchiveTrack = {
  id: string;
  title: string;
  duration?: string;
};

/** Scroll sections currently wired on the album detail page. */
export type ArchiveSectionId = "core" | "dna" | "tracks";

export type ArchiveSectionNavItem = {
  id: ArchiveSectionId;
  label: string;
};

/** Album detail card (music-only focus). */
export type ArchiveDetail = {
  id: string;
  slug: string;
  title: string;
  year: number;
  country: string;
  duration?: string;
  status: ArchiveStatus;
  shortDescription: string | string[];
  editorNote?: string;
  artist: string;
  label?: string;
  availability: ArchiveAvailabilityLink[];
  /** Cover + alt art. */
  gallery: ArchiveGallerySlide[];
  characteristics?: ArchiveCharacteristics;
  categories?: ArchiveCategories;
  tracks?: ArchiveTrack[];
};

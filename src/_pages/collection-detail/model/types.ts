export type CollectionStatus = "Released" | "Ongoing" | "Upcoming" | "Restored";

export type CollectionAvailabilityLink = {
  label: string;
  href: string;
};

export type CollectionCover = {
  url: string;
  alt: string;
};

export type CollectionCharacteristics = {
  oddity: string[];
  meme: string[];
};

export type CollectionCategories = {
  genres?: string[];
  themes?: string[];
  atmosphere?: string[];
  mood?: string[];
  tags?: string[];
};

export type CollectionTrack = {
  id: string;
  title: string;
  duration?: string;
};

/** Scroll sections currently wired on the album detail page. */
export type CollectionSectionId = "core" | "dna" | "tracks";

export type CollectionSectionNavItem = {
  id: CollectionSectionId;
  label: string;
};

/** Album detail card (music-only focus). */
export type CollectionDetail = {
  id: string;
  slug: string;
  title: string;
  year: number;
  country: string;
  duration?: string;
  status: CollectionStatus;
  shortDescription: string | string[];
  editorNote?: string;
  artist: string;
  label?: string;
  availability: CollectionAvailabilityLink[];
  /** Single album cover. */
  cover: CollectionCover;
  characteristics?: CollectionCharacteristics;
  categories?: CollectionCategories;
  tracks?: CollectionTrack[];
};

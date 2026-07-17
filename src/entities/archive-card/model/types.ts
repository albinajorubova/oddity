export type ArchiveItemAspect =
  | "square"
  | "portrait"
  | "tall"
  | "landscape"
  | "wide";

export type ArchiveGalleryImage = {
  url: string;
  aspect: ArchiveItemAspect;
};

export type ArchiveItem = {
  id: string;
  slug: string;
  artist: string;
  title: string;
  year: number;
  category: string;
  imageUrl: string;
  aspect: ArchiveItemAspect;
  galleryImages?: ArchiveGalleryImage[];
};

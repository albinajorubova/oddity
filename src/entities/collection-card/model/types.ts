export type CollectionItemAspect =
  | "square"
  | "portrait"
  | "tall"
  | "landscape"
  | "wide";

export type CollectionGalleryImage = {
  url: string;
  aspect: CollectionItemAspect;
};

export type CollectionItem = {
  id: string;
  slug: string;
  artist: string;
  title: string;
  year: number;
  category: string;
  imageUrl: string;
  aspect: CollectionItemAspect;
  galleryImages?: CollectionGalleryImage[];
};

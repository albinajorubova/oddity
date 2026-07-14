export type ArchiveItemAspect =
  | "square"
  | "portrait"
  | "tall"
  | "landscape"
  | "wide";

export type ArchiveItem = {
  id: string;
  slug: string;
  artist: string;
  title: string;
  year: number;
  category: string;
  imageUrl: string;
  aspect: ArchiveItemAspect;
};

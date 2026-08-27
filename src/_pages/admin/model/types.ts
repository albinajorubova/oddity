import type { CollectionItemAspect } from "@entities/collection-card";

export type PublishStatus = "draft" | "public";

export type AdminCardType = "movie" | "album" | "series" | "book";

export type AdminCard = {
  id: string;
  slug: string;
  title: string;
  /** Director / artist / author — meta line under title in library */
  credit: string;
  type: AdminCardType;
  year: number;
  country: string;
  shortDescription: string;
  imageUrl: string;
  aspect: CollectionItemAspect;
  publishStatus: PublishStatus;
};

export type AdminFilter = "all" | "draft" | "public";

export type AdminProfile = {
  role: string;
  established: string;
  cards: AdminCard[];
};

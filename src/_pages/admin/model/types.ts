import type { CollectionItemAspect } from "@entities/collection-card";

export type PublishStatus = "draft" | "public";

export type AdminCard = {
  id: string;
  slug: string;
  title: string;
  /** Director / artist / author — meta line under title in library */
  credit: string;
  /** Human-readable work type, e.g. Album, Track */
  typeLabel: string;
  /** Preformatted meta: `ALBUM · 1973` */
  metaLine: string;
  year: number | null;
  shortDescription: string;
  imageUrl: string;
  aspect: CollectionItemAspect;
  publishStatus: PublishStatus;
};

export type AdminFilter = "all" | "draft" | "public";

export type AdminProfile = {
  role: string;
  established: string;
};

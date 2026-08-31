export type Person = {
  id: string;
  documentId?: string;
  name: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/** Strapi component `cards.person-ref` — role implied by parent work type. */
export type PersonRef = {
  id?: number;
  person: Person | null;
};

export type WorkType = "music" | "movie" | "series" | "anime" | "book" | "game";

/** UI label for people on a work card (no explicit role field). */
export const getPersonLabel = (workType: WorkType): string => {
  switch (workType) {
    case "music":
      return "Artist";
    case "movie":
      return "Director";
    case "series":
    case "anime":
      return "Creator";
    case "book":
      return "Author";
    case "game":
      return "Developer";
    default:
      return "Person";
  }
};

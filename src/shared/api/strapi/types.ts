export type PublicationStatus = "draft" | "published";

export type StrapiFindQuery = {
  status?: PublicationStatus;
  filters?: Record<string, unknown>;
  populate?: string | Record<string, unknown> | string[];
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};

export type StrapiMutationQuery = {
  status?: PublicationStatus;
  populate?: string | Record<string, unknown> | string[];
};

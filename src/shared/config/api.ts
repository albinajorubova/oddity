import { isServer } from "./vars";

export type StrapiConfigType = {
  strapiUrl: string;
  strapiNetworkUrl: string;
  strapiApiToken: string;
  previewSecret?: string;
};

export const baseUrl = `http://${process.env.PROJECT_SLUG}:1337/api`;

export const STRAPI_CONFIG: StrapiConfigType = {
  strapiUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1337",
  strapiNetworkUrl:
    (isServer ? baseUrl : process.env.NEXT_PUBLIC_SITE_URL) || "",
  strapiApiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",
  previewSecret: process.env.PREVIEW_SECRET,
};

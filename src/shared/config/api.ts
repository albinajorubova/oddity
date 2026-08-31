import { isServer } from "./vars";

export type StrapiConfigType = {
  strapiUrl: string;
  strapiNetworkUrl: string;
  strapiApiToken: string;
  previewSecret?: string;
};

const getStrapiNetworkUrl = (): string => {
  const publicUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:1337";

  const dockerSlug = process.env.PROJECT_SLUG;
  if (isServer && dockerSlug) {
    return `http://${dockerSlug}:1337/api`;
  }

  return `${publicUrl.replace(/\/$/, "")}/api`;
};

export const baseUrl = getStrapiNetworkUrl();

export const STRAPI_CONFIG: StrapiConfigType = {
  strapiUrl:
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:1337",
  strapiNetworkUrl: getStrapiNetworkUrl(),
  strapiApiToken:
    process.env.STRAPI_API_TOKEN ||
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
    "",
  previewSecret: process.env.PREVIEW_SECRET,
};

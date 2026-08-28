import { isServer, STRAPI_CONFIG } from "@shared/config";

export const getStrapiApiUrl = (): string => {
  const publicUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    STRAPI_CONFIG.strapiUrl ||
    "http://localhost:1337";

  const dockerSlug = process.env.PROJECT_SLUG;
  if (isServer && dockerSlug) {
    return `http://${dockerSlug}:1337/api`;
  }

  return `${publicUrl.replace(/\/$/, "")}/api`;
};

import { strapi } from "@strapi/client";

import { STRAPI_CONFIG } from "@shared/config";

export const strapiClient = strapi({
  baseURL: STRAPI_CONFIG.strapiNetworkUrl,
  auth: STRAPI_CONFIG.strapiApiToken,
});

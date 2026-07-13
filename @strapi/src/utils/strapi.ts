import type { Core } from "@strapi/strapi";

/**
 * Получает базовый URL Strapi из переменных окружения или конфигурации
 */
export function getStrapiUrl(strapi: Core.Strapi): string {
  const envUrl = process.env.STRAPI_URL;
  if (envUrl) {
    return envUrl;
  }
  return "http://localhost:1337";
}

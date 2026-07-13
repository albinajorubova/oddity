import type { Core } from "@strapi/strapi";

import { getStrapiUrl, isObject, transformApiResponse } from "../utils";

/**
 * Проверяет, является ли строка валидной ссылкой или email
 */
const isValidLinkOrEmail = (input: string): boolean => {
  const regex =
    /^(https?:\/\/([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?|[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,})$/i;
  return regex.test(input);
};

const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

/**
 * Тип объекта, у которого может быть url
 */
type UrlData = {
  url?: string | null;
  [key: string]: unknown;
};

/**
 * Нормализует URL: добавляет префикс Strapi или mailto для email
 */
const normalizeUrl = <T extends UrlData>(
  data: T,
  strapiUrl: string,
): T => {
  if (!data.url) {
    return data;
  }

  if (isValidLinkOrEmail(data.url)) {
    if (emailRegex.test(data.url)) {
      return {
        ...data,
        url: `mailto:${data.url}`,
      };
    }
    return data;
  }

  return {
    ...data,
    url: `${strapiUrl}${data.url}`,
  };
};


/**
 * Рекурсивно обрабатывает объект и нормализует все URL
 */
const rebuildUrl = (obj: unknown, strapiUrl: string): unknown => {
  if (isObject(obj)) {
    const n: Record<string, unknown> = {};

    Object.keys(obj).forEach((k) => {
      n[k] = rebuildUrl(obj[k], strapiUrl);
    });

    if ("url" in obj) {
      return normalizeUrl(obj as UrlData, strapiUrl);
    }

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => rebuildUrl(i, strapiUrl));
  }

  return obj;
};

export default (_config: unknown, options: { strapi: Core.Strapi }) => {
  const strapiUrl = getStrapiUrl(options.strapi);

  return async (
    ctx: {
      status: number;
      body?: unknown;
      url?: string;
      request?: {
        url?: string;
      };
    },
    next: () => Promise<void>,
  ) => {
    await next();

    transformApiResponse(ctx, (data) => rebuildUrl(data, strapiUrl));
  };
};

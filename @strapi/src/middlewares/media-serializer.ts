import type { Core } from "@strapi/strapi";

import { transformApiResponse } from "../utils";

/**
 * Проверяет, является ли объект компонентом shared.media
 */
function isMediaComponent(obj: unknown): obj is {
  hasADifferentImageOnViewports?: boolean;
  media?: unknown;
  lg?: unknown;
  md?: unknown;
  sm?: unknown;
  xs?: unknown;
  [key: string]: unknown;
} {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const objRecord = obj as Record<string, unknown>;
  return "hasADifferentImageOnViewports" in objRecord && "media" in objRecord;
}

/**
 * Рекурсивно преобразует компонент media в нужный формат
 */
function transformMediaComponent(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformMediaComponent(item));
  }

  if (typeof obj === "object") {
    const objRecord = obj as Record<string, unknown>;
    const transformed: Record<string, unknown> = {};

    // Сначала рекурсивно обрабатываем все поля
    for (const [key, value] of Object.entries(objRecord)) {
      transformed[key] = transformMediaComponent(value);
    }

    // Если это компонент shared.media, преобразуем его
    if (isMediaComponent(transformed)) {
      const result: Record<string, unknown> = {};

      // Копируем все остальные поля (если есть)
      for (const [key, value] of Object.entries(transformed)) {
        if (
          ![
            "hasADifferentImageOnViewports",
            "isLg",
            "isMd",
            "isSm",
            "isXs",
            "media",
            "lg",
            "md",
            "sm",
            "xs",
          ].includes(key)
        ) {
          result[key] = value;
        }
      }

      return {
        id: transformed.id,
        xs: transformed.xs,
        sm: transformed.sm,
        md: transformed.md,
        lg: transformed.lg,
        default: transformed.media,
      };
    }

    return transformed;
  }

  return obj;
}

export default (_config: unknown, _options: { strapi: Core.Strapi }) => {
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

    transformApiResponse(ctx, (data) => transformMediaComponent(data));
  };
};

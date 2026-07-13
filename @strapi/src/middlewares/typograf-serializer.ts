import type { Core } from "@strapi/strapi";
import Typograf from "typograf";

import { isObject, transformApiResponse } from "../utils";

const tp = Typograf ? new Typograf({ locale: ["ru", "en-US"] }) : null;

tp.disableRule("common/space/delLeadingBlanks");
tp.disableRule("common/space/trimLeft");
tp.disableRule("common/space/trimRight");

// tp.disableRule('*');

/**
 * Рекурсивно обрабатывает объект и применяет Typograf к текстовым полям
 */
const rebuildTypograf = (
  obj: unknown,
  params?: {
    lastKey?: string | undefined;
  },
): unknown => {
  if (!tp) {
    // Typograf не установлен, возвращаем объект без изменений
    return obj;
  }

  if (isObject(obj)) {
    const objRecord = obj as Record<string, unknown>;
    const n: Record<string, unknown> = {};

    Object.keys(objRecord).forEach((k) => {
      n[k] = rebuildTypograf(objRecord[k], { lastKey: k });
    });

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => {
      return rebuildTypograf(i, params);
    });
  }

  if (params?.lastKey) {
    const lastKey = params.lastKey;
    const someIndexOf = ["title", "text", "description", "overviewTitle"].some(
      (item) => {
        return lastKey.indexOf(item) !== -1;
      },
    );

    if (someIndexOf && typeof obj === "string") {
      return tp.execute(obj);
    }
  }

  return obj;
};

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

    transformApiResponse(ctx, (data) => rebuildTypograf(data));
  };
};

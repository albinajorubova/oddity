import { is } from "@shared/utils/is";
import { toCamelCaseAdvanced } from "@shared/utils/string";

import type { RebuildableValue } from "./types";

export const rebuildCamelCase = (obj: RebuildableValue): RebuildableValue => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (is.obj(obj)) {
    const objRecord = obj as Record<string, RebuildableValue>;
    const n: Record<string, RebuildableValue> = {};

    Object.keys(objRecord).forEach((k) => {
      const camelKey = toCamelCaseAdvanced(k);
      n[camelKey] = rebuildCamelCase(objRecord[k]);
    });

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((el) => rebuildCamelCase(el));
  }

  return obj;
};

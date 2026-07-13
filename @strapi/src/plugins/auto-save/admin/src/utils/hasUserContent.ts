import { INTERNAL_FIELDS } from "./constants";

const isFilled = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return false;
};

export const hasUserContent = (values?: Record<string, unknown>) => {
  if (!values) return false;

  return Object.entries(values).some(
    ([key, value]) =>
      !INTERNAL_FIELDS.includes(key as (typeof INTERNAL_FIELDS)[number]) &&
      isFilled(value),
  );
};

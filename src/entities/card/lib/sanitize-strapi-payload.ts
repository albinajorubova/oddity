type JsonRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Removes null/undefined so Strapi optional fields are omitted, not sent as null. */
export const stripNullish = <T extends JsonRecord>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  ) as Partial<T>;

export const stripNullishDeep = (value: unknown): unknown => {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.map(stripNullishDeep).filter((item) => item !== undefined);
  }

  if (!isPlainObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) => {
      const cleaned = stripNullishDeep(item);
      if (cleaned === undefined) return [];
      return [[key, cleaned]];
    }),
  );
};

export const getErrorDetails = (error: unknown): unknown => {
  if (!error || typeof error !== "object") return error;

  const record = error as Record<string, unknown>;

  return stripNullishDeep({
    name: record.name,
    message: record.message,
    status: record.status,
    statusCode: record.statusCode,
    response: record.response,
    cause: record.cause,
    details: record.details,
    data: record.data,
  });
};

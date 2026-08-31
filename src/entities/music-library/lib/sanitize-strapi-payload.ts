export const stripNullish = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined),
  ) as Partial<T>;

export const getErrorDetails = (error: unknown): unknown => {
  if (!error || typeof error !== "object") return error;

  const record = error as Record<string, unknown>;

  return stripNullish({
    name: record.name,
    message: record.message,
    status: record.status,
    statusCode: record.statusCode,
    response: record.response,
    data: record.data,
  });
};

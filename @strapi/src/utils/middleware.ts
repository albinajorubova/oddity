/**
 * Тип контекста для middleware
 */
export type MiddlewareContext = {
  status: number;
  body?: unknown;
  url?: string;
  request?: {
    url?: string;
  };
};

/**
 * Проверяет, является ли запрос API запросом
 */
export const isApiRequest = (url: string): boolean => {
  return url.startsWith("/api/");
};

/**
 * Получает URL из контекста
 */
export const getContextUrl = (ctx: MiddlewareContext): string => {
  return ctx.url || ctx.request?.url || "";
};

/**
 * Проверяет, нужно ли обрабатывать ответ API
 */
export const shouldProcessApiResponse = (ctx: MiddlewareContext): boolean => {
  const url = getContextUrl(ctx);
  return (
    isApiRequest(url) &&
    ctx.status === 200 &&
    ctx.body !== null &&
    ctx.body !== undefined &&
    typeof ctx.body === "object"
  );
};

/**
 * Применяет трансформацию к телу ответа API
 */
export const transformApiResponse = <T>(
  ctx: MiddlewareContext,
  transformFn: (data: unknown) => T,
): void => {
  if (!shouldProcessApiResponse(ctx)) {
    return;
  }

  // В этом месте ctx.body гарантированно не null и не undefined благодаря shouldProcessApiResponse
  const body = ctx.body as Record<string, unknown> | unknown[];

  if (Array.isArray(body)) {
    ctx.body = transformFn(body);
  } else if (typeof body === "object" && body !== null && "data" in body) {
    const bodyWithData = body as { data: unknown };
    bodyWithData.data = transformFn(bodyWithData.data);
  } else if (typeof body === "object" && body !== null) {
    ctx.body = transformFn(body);
  }
};

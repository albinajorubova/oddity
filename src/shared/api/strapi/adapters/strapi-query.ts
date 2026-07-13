// Simple helper to build Strapi query params objects in a typed-friendly way
export type StrapiQuery = Record<string, string | number | boolean | undefined>;

export function withPagination(page = 1, pageSize = 10): StrapiQuery {
  return {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
  };
}

export function withLocale(locale?: string): StrapiQuery {
  return locale ? { locale } : {};
}

export function withPopulate(populate: string | string[] = "*"): StrapiQuery {
  if (Array.isArray(populate)) {
    return Object.fromEntries(
      populate.map((p, i) => [i === 0 ? "populate" : `populate[${i}]`, p]),
    );
  }
  return { populate };
}

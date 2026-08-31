export type ArchiveMetaInput = {
  typeLabel: string;
  year?: number | null;
  country?: string | null;
};

/** ISO date (`YYYY-MM-DD`) or partial → release year for display. */
export const formatReleaseYear = (
  releaseDate: string | null | undefined,
): number | null => {
  if (!releaseDate?.trim()) return null;

  const year = Number.parseInt(releaseDate.slice(0, 4), 10);
  return Number.isFinite(year) ? year : null;
};

/** Meta line under title: `ALBUM · 1973 · UK` */
export const formatArchiveMetaLine = ({
  typeLabel,
  year,
  country,
}: ArchiveMetaInput): string => {
  const parts = [typeLabel.trim()];

  if (year != null && year > 0) {
    parts.push(String(year));
  }

  const normalizedCountry = country?.trim();
  if (normalizedCountry && normalizedCountry !== "—") {
    parts.push(normalizedCountry.toUpperCase());
  }

  return parts.map((part) => part.toUpperCase()).join(" · ");
};

export type PersonCreditRef = {
  person?: { name?: string | null } | null;
};

/** Comma-separated names from `people[]` component refs. */
export const formatPersonCredit = (
  people: PersonCreditRef[] | null | undefined,
  fallback = "Unknown artist",
): string => {
  const names = (people ?? []).flatMap((ref) => {
    const name = ref.person?.name?.trim();
    return name ? [name] : [];
  });

  return names.length ? names.join(", ") : fallback;
};

export const slugFromYoutube = (
  title: string | null,
  youtubeId: string,
): string => {
  const normalized = (title ?? "untitled")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const suffix = youtubeId.slice(0, 8);

  return normalized ? `${normalized}-${suffix}` : suffix;
};

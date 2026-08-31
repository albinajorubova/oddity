import type { MusicItem } from "../model";

const hasNamedPeople = (item: MusicItem): boolean =>
  item.people.some((ref) => Boolean(ref.person?.name?.trim()));

export const coalesceMusicItemFromDraft = (
  published: MusicItem,
  draft: MusicItem | null | undefined,
): MusicItem => {
  if (!draft) return published;

  const people =
    hasNamedPeople(published) || !hasNamedPeople(draft)
      ? published.people
      : draft.people;

  const coverUrl = published.coverUrl?.trim() || draft.coverUrl;
  const description = published.description?.trim()
    ? published.description
    : draft.description;
  const tracks =
    published.tracks?.length || !draft.tracks?.length
      ? published.tracks
      : draft.tracks;

  if (
    people === published.people &&
    coverUrl === published.coverUrl &&
    description === published.description &&
    tracks === published.tracks
  ) {
    return published;
  }

  return {
    ...published,
    people,
    coverUrl,
    description,
    tracks,
  };
};

export const coalescePublishedWithDrafts = (
  published: MusicItem[],
  drafts: MusicItem[],
): MusicItem[] => {
  const draftsBySlug = new Map(
    drafts.map((item) => [item.documentId ?? item.slug, item]),
  );

  return published.map((item) => {
    const draft = draftsBySlug.get(item.documentId ?? item.slug);
    return coalesceMusicItemFromDraft(item, draft);
  });
};

export const mergeDraftAndPublishedMusicItems = (
  drafts: MusicItem[],
  published: MusicItem[],
): MusicItem[] => {
  const publishedByKey = new Map(
    published.map((item) => [item.documentId ?? item.slug, item]),
  );
  const draftsByKey = new Map(
    drafts.map((item) => [item.documentId ?? item.slug, item]),
  );
  const keys = new Set([...publishedByKey.keys(), ...draftsByKey.keys()]);

  return [...keys].flatMap((key) => {
    const pub = publishedByKey.get(key);
    const draft = draftsByKey.get(key);

    if (pub && draft) {
      return [coalesceMusicItemFromDraft(pub, draft)];
    }

    return (pub ?? draft) ? [pub ?? draft!] : [];
  });
};

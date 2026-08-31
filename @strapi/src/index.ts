import type { Core } from "@strapi/strapi";

const MUSIC_ITEM_TYPES = [
  { name: "Album", slug: "album" },
  { name: "EP", slug: "ep" },
  { name: "Single", slug: "single" },
  { name: "Track", slug: "track" },
  { name: "Playlist", slug: "playlist" },
  { name: "Live Performance", slug: "live-performance" },
  { name: "Compilation", slug: "compilation" },
] as const;

const seedMusicItemTypes = async (strapi: Core.Strapi): Promise<void> => {
  const types = strapi.documents("api::music-item-type.music-item-type");

  for (const entry of MUSIC_ITEM_TYPES) {
    const existing = await types.findFirst({
      filters: { slug: { $eq: entry.slug } },
    });

    if (!existing) {
      await types.create({ data: { name: entry.name, slug: entry.slug } });
    }
  }
};

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedMusicItemTypes(strapi);
  },
};

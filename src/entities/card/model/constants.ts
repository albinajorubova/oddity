export const CARD_TYPES = [
  "movie",
  "series",
  "anime",
  "music",
  "book",
  "game",
] as const;

export const MUSIC_KINDS = ["song", "album", "playlist"] as const;

export const RELEASE_STATUSES = ["Released", "Ongoing", "Upcoming"] as const;

export const CURATOR_STATUSES = ["draft", "public"] as const;

export const STRAPI_CARD_COLLECTION = "cards" as const;

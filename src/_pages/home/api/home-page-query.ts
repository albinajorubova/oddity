import type { StrapiFindQuery } from "@shared/api/strapi";

export const homePageQuery = (
  status?: "draft" | "published",
): StrapiFindQuery => ({
  populate: {
    media: {
      populate: {
        media: { populate: "*" },
        lg: { populate: "*" },
        md: { populate: "*" },
        sm: { populate: "*" },
        xs: { populate: "*" },
      },
    },
  },
  status,
});

import { strapiClient } from "@shared/api/strapi";

/**
 * Получает данные главной страницы из Strapi
 * @param options - Опции для запроса, включая status для draft mode
 */
export const getHomePage = async (options?: { status?: "draft" | "published" }) => {
  const homepage = strapiClient.single("home-page");

  const findOptions: Parameters<typeof homepage.find>[0] = {
    populate: {
      media: {
        populate: {
          media: {
            populate: "*",
          },
          lg: {
            populate: "*",
          },
          md: {
            populate: "*",
          },
          sm: {
            populate: "*",
          },
          xs: {
            populate: "*",
          },
        },
      },
    },
  };

  // Добавляем status, если указан (для draft mode)
  if (options?.status) {
    findOptions.status = options.status;
  }

  const json = await homepage.find(findOptions);

  return json.data;
};

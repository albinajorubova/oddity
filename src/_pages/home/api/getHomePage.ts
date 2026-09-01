import { strapiClient } from "@shared/api/strapi";

import { homePageQuery } from "./home-page-query";

export const getHomePage = async (options?: {
  status?: "draft" | "published";
}) => {
  const homepage = strapiClient.single("home-page");
  const response = await homepage.find(homePageQuery(options?.status));

  return response.data;
};

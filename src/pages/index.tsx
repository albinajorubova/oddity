import type { GetServerSidePropsContext } from "next";

import { getServerSidePropsData } from "@shared/api/strapi/getServerSidePropsData";
//
import { getHomePage } from "@/_pages/home/api";
import type { HomePageProps } from "@/_pages/home/model/schemas";
import { HomePage } from "@/_pages/home/ui";

const Page = () => {
  return <HomePage />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Проверяем, включен ли draft mode
  const isDraftMode = context.draftMode || false;

  const data = await getServerSidePropsData(
    {
      homePage: getHomePage,
    },
    { isDraftMode },
  );

  const { homePage } = data as {
    homePage: HomePageProps;
  };

  return {
    props: {
      isDraftMode,
      cms: {
        // pageSeoData: homePage?.seo || null,
        homePage,
        // commonData,
      },
    },
  };
}

export default Page;

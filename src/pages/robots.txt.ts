import type { GetServerSidePropsContext } from "next";

import { siteURL } from "@shared/config";

const Robots = (): null => {
  return null;
};

export const getServerSideProps = ({
  res,
}: GetServerSidePropsContext): { props: Record<string, never> } => {
  const robots =
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? `User-agent: *\nAllow: / \nSitemap: ${siteURL.origin}/sitemap.xml\nHost: ${siteURL.origin}`
      : `User-agent: *\nDisallow: /`;

  res.setHeader("Content-Type", "text/plain");
  res.write(robots);
  res.end();

  return {
    props: {},
  };
};

export default Robots;

import fs from "fs";
import type { GetServerSidePropsContext } from "next";

import { siteURL } from "@shared/config";

const Sitemap = (): null => {
  return null;
};

export const getServerSideProps = async ({
  res,
}: GetServerSidePropsContext): Promise<{ props: Record<string, never> }> => {
  const staticPages: string[] = fs
    .readdirSync("src/pages")
    .filter((staticPage: string) => {
      return ![
        ".DS_Store",
        "_app.js",
        "_document.js",
        "404.js",
        "sitemap.xml.js",
        "robots.txt.js",
        "index.js.js",
        "api",
        "articles",
      ].includes(staticPage);
    })
    .map((staticPagePath: string) => {
      return `${siteURL.href}${encodeURIComponent(staticPagePath)}`;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteURL.origin}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
      ${staticPages
        .map((url: string) => {
          return `
            <url>
              <loc>${url.replace(".js", "")}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

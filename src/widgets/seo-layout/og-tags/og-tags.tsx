import Head from "next/head";
import { useRouter } from "next/router";

import { APP_INFO } from "@shared/config";

import { mergeSeoData } from "./utils";
import type { SeoLayoutDataType } from "../type";

export const OgTags = (props: SeoLayoutDataType) => {
  const { asPath } = useRouter();
  const curLink = asPath.split("?")[0];

  const { title, description, keywords, ogImage, theme, origin } = mergeSeoData(props);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content={theme} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${origin}${curLink}`} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={APP_INFO.APP_DOMAIN || ""} />
      <meta property="twitter:url" content={`${origin}${curLink}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" content={`${origin}${curLink}`} />
    </Head>
  );
};

OgTags.displayName = "OgTags";

import { APP_INFO } from "@shared/config";

import type { SeoLayoutDataType } from "../type";

const isEmpty = (value?: string | null): boolean => {
  return !value || value.trim() === "";
};

export const mergeSeoData = ({
  commonSeoData,
  pageSeoData,
}: SeoLayoutDataType) => {
  const baseTitle = commonSeoData?.title;
  const baseDescription = commonSeoData?.description;
  const baseKeywords = commonSeoData?.keywords;
  const baseOgImage = commonSeoData?.ogImage;
  const baseTheme = commonSeoData?.theme;
  let mergedTitle: string;

  if (pageSeoData && !isEmpty(pageSeoData.title)) {
    if (pageSeoData.title === baseTitle) {
      mergedTitle = pageSeoData.title || "";
    } else {
      mergedTitle = `${pageSeoData.title}${baseTitle ? ` | ${baseTitle}` : ""}`;
    }
  } else {
    mergedTitle = baseTitle || "";
  }

  if (isEmpty(mergedTitle)) {
    mergedTitle = APP_INFO.APP_DEFAULT_TITLE;
  }

  const mergedDescription =
    pageSeoData && !isEmpty(pageSeoData.description)
      ? pageSeoData.description
      : baseDescription || APP_INFO.APP_DESCRIPTION;

  const mergedKeywords =
    (pageSeoData && !isEmpty(pageSeoData.keywords)
      ? pageSeoData.keywords
      : baseKeywords) || APP_INFO.APP_KEYWORDS;

  const mergedOgImage =
    pageSeoData?.ogImage?.url || baseOgImage?.url || APP_INFO.APP_DEFAULT_OG;

  const mergedTheme =
    pageSeoData && !isEmpty(pageSeoData.theme)
      ? pageSeoData.theme
      : baseTheme || APP_INFO.APP_DEFAULT_THEME;

  return {
    title: mergedTitle,
    description: mergedDescription,
    keywords: mergedKeywords,
    ogImage: mergedOgImage,
    theme: mergedTheme,
    origin: APP_INFO.APP_SITE_URL_ORIGIN,
  };
};

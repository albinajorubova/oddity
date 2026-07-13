export const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
export const siteOrigin = siteURL.origin;

export const APP_INFO = {
  APP_DEFAULT_TITLE: "",
  APP_TITLE_TEMPLATE: "%s",
  APP_DESCRIPTION: "",
  APP_KEYWORDS: "",
  APP_DEFAULT_THEME: "#000000",
  APP_SITE_URL_ORIGIN: siteOrigin || "",
  APP_BASE_URL: siteURL,
  APP_DOMAIN: siteURL.hostname,
  APP_DEFAULT_OG: "/og.png",
};

export type AppInfoType = typeof APP_INFO;

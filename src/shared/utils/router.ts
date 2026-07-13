import { APP_INFO } from "@shared/config";

/**
 * Checks is link is external or not.
 */

export const checkIsExternal = (href: string) => {
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;
  const url = new URL(href);
  return url.hostname !== APP_INFO.APP_BASE_URL.hostname;
};

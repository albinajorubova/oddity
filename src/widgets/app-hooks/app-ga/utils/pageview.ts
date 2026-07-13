import { gaTrackingId } from "@/shared/config/vars";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (!window.gtag) {
    console.warn("window.gtag is not defined");
    return;
  }
  window.gtag("config", gaTrackingId, {
    page_path: url,
  });
};

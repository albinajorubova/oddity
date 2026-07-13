// https://developers.google.com/analytics/devguides/collection/gtagjs/events

import type { GAEvent } from "../types";

export const event = ({ action, category, label, value }: GAEvent): void => {
  if (!window.gtag) {
    console.warn("window.gtag is not defined");
    return;
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

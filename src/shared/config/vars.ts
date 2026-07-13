export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
export const isClient = typeof document !== "undefined";
export const isServer = !isClient;

export const isProdServer = process.env.NEXT_PUBLIC_APP_ENV === "production";
export const isStagingServer = process.env.NEXT_PUBLIC_APP_ENV === "staging";

export const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

export const yandexTrackingId = Number(
  process.env.NEXT_PUBLIC_YANDEX_TRACKING_ID,
);


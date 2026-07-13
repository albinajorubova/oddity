import { setUa } from "./lib/parse";

export const setUserAgent = (userAgent: string) => setUa(userAgent);

export const mockUserAgent = (userAgent: string) => {
  // eslint-disable-next-line no-restricted-properties
  (window.navigator as any).__defineGetter__("userAgent", () => userAgent);
};

export const setDefaults = (p?: string, d: string = "none"): string => p || d;

export const getNavigatorInstance = (): Navigator | false => {
  if (typeof window !== "undefined") {
    if (window.navigator || navigator) {
      return window.navigator || navigator;
    }
  }
  return false;
};

export const isIOS13Check = (type: string): boolean => {
  const nav = getNavigatorInstance() as Navigator & {
    platform?: string;
    maxTouchPoints?: number;
    MSStream?: unknown;
  };
  return (
    !!nav &&
    !!nav.platform &&
    (nav.platform.indexOf(type) !== -1 ||
      (nav.platform === "MacIntel" &&
        nav.maxTouchPoints! > 1 &&
        !(window as any).MSStream))
  );
};

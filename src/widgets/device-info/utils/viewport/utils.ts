import { MEDIA_QUERY, VIEWPORTS } from "./constants";

export type Viewports = {
  [key: string]: boolean | string | undefined;
  current?: string;
};

export const getShortKey = (v: string): string =>
  `is${v[0].toUpperCase() + v.slice(1).toLowerCase()}`;

export const VIEWPORTS_INITIAL: Viewports = Object.keys(VIEWPORTS).reduce(
  (a, v) => ({ ...a, [getShortKey(v)]: false }),
  {},
);

export const getViewports = (): Viewports => {
  const viewports = { ...VIEWPORTS_INITIAL };

  Object.keys(VIEWPORTS).forEach((viewport) => {
    const mediaQueryList = window.matchMedia(
      MEDIA_QUERY[viewport as keyof typeof VIEWPORTS],
    );
    viewports[getShortKey(viewport)] = !!mediaQueryList.matches;
  });

  return viewports;
};

export const getCurrentViewport = (viewports: Viewports): string | undefined =>
  Object.keys(viewports).find((item) => viewports[item] === true);

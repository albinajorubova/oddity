import { useSyncExternalStore } from "react";

import { getMasonryColumnCount } from "./build-masonry";
import type { MasonryColumnsConfig } from "./types";
import { DEFAULT_MASONRY_COLUMNS } from "./types";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
};

const getServerSnapshot = (config: MasonryColumnsConfig) =>
  config.breakpoints[0]?.columns ?? config.defaultColumns;

export const useMasonryColumns = (
  config: MasonryColumnsConfig = DEFAULT_MASONRY_COLUMNS,
): number => {
  return useSyncExternalStore(
    subscribe,
    () => getMasonryColumnCount(window.innerWidth, config),
    () => getServerSnapshot(config),
  );
};

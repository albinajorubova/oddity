import { useSyncExternalStore } from "react";

import {
  getAutoSaveState,
  subscribeAutoSaveState,
} from "../store/autoSaveStore";

export const useAutoSaveStore = () => {
  return useSyncExternalStore(
    subscribeAutoSaveState,
    getAutoSaveState,
    getAutoSaveState,
  );
};

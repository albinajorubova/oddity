import { useContext } from "react";
import { useStore } from "zustand";

import { type DataStore, type DataStoreState, StoreContext } from "../context";

export function useDataStore<TSelected>(
  selector: (state: DataStoreState) => TSelected,
): TSelected {
  const dataStoreContext = useContext(StoreContext);

  if (!dataStoreContext) {
    throw new Error("useDataStore must be used within StoreContext");
  }

  // useStore typings accept the vanilla store (StoreApi)
  return useStore(dataStoreContext as DataStore, selector);
}

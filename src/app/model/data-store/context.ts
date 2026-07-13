import { createContext } from "react";
import type { StoreApi } from "zustand/vanilla";

export type DataStoreState = {
  actions: {
    setData: (newData: Partial<Record<string, unknown>>) => void;
  };
  // Index signature to allow arbitrary data keys merged via setData
  [key: string]: unknown;
};

export type DataStore = StoreApi<DataStoreState>;

export const StoreContext = createContext<DataStore | null>(null);

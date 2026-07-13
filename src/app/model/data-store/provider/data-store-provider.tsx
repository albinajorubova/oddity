import { type PropsWithChildren, useEffect, useRef } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import { type DataStoreState, StoreContext } from "../context";

type DataStoreProviderProps<
  TState extends Record<string, unknown> = Record<string, unknown>,
> = PropsWithChildren<{
  data: TState;
}>;

function createDataStore<TState extends Record<string, unknown>>(
  initialState: TState,
): StoreApi<DataStoreState & TState> {
  return createStore<DataStoreState & TState>((set) => ({
    ...initialState,
    actions: {
      setData: (newData) => set((state) => ({ ...state, ...newData })),
    },
  }));
}

export function DataStoreProvider<TState extends Record<string, unknown>>({
  children,
  data,
}: DataStoreProviderProps<TState>) {
  const storeRef = useRef<StoreApi<DataStoreState & TState> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createDataStore<TState>(data);
  }

  useEffect(() => {
    storeRef.current?.getState().actions.setData(data);
  }, [data]);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

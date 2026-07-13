export type RebuildableValue = unknown;
export type RebuildFunction = (
  data: unknown,
  params?: {
    lastKey: string | undefined;
  },
) => unknown;

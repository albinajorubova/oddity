import { defaultEnable, functions as rebuildFunctions } from "./functions";

type RebuildFunction = (data: unknown, params?: unknown) => unknown;

type RebuildParams = Record<string, boolean | unknown>;

type RebuildData = unknown;

const rebuild = (data: RebuildData, params?: RebuildParams): RebuildData => {
  const _params: Record<string, boolean | unknown> = {
    ...defaultEnable,
    ...params,
  };

  const functions: RebuildFunction[] = Object.keys(_params)
    .map((el): RebuildFunction | null => {
      const index = parseInt(el, 10);
      if (!Number.isNaN(index) && rebuildFunctions[index]) {
        return _params[el]
          ? (_newData: RebuildData) => rebuildFunctions[index](_newData)
          : null;
      }
      return null;
    })
    .filter((el): el is RebuildFunction => el !== null);

  return functions.reduce((acc, currentFunc) => currentFunc(acc), data);
};

export async function rebuildWrap<T = unknown>(
  request: Promise<T>,
): Promise<RebuildData> {
  const data = await request;

  return rebuild(data);
}

export default rebuild;

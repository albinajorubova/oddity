import type { DependencyList } from "react";
import { useMemo } from "react";

const useVariables = <T extends object>(
  data: T,
  deps: DependencyList = [],
): T => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(() => ({ ...data }), deps); // eslint-disable-line
};

export default useVariables;

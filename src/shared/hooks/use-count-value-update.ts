import { useRef } from "react";

/**
 * Returns a ref that increments when value changes.
 * Useful for forcing re-mount/transition when switching back to the same value.
 */
export const useCountValueUpdate = <T>(value: T): React.RefObject<number> => {
  const countRef = useRef(0);
  const prevValueRef = useRef<T>(value);

  if (prevValueRef.current !== value) {
    countRef.current++;
    prevValueRef.current = value;
  }

  return countRef;
};

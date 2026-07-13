import { useEffect, useRef } from "react";

function useValueUpdate<T>(
  func: (value: T) => void | (() => void),
  value: T,
): void {
  const prevValue = useRef<T>(value);
  useEffect(() => {
    let cleanupFunc: void | (() => void);

    if (prevValue.current !== value) {
      cleanupFunc = func(value);
      prevValue.current = value;
    }
    return () => {
      if (typeof cleanupFunc === "function") {
        cleanupFunc();
      }
    };
  }, [value, func]);
}
export default useValueUpdate;

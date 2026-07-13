import type { RefObject } from "react";
import { useEffect } from "react";

export function useOnClickOutside<T extends HTMLDivElement | null>(
  ref: RefObject<T> | RefObject<T>[],
  classes: string[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
): void {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Do nothing if the target is not connected element with document
    if (!target || !target.isConnected) {
      return;
    }

    const isOutside = Array.isArray(ref)
      ? ref
          .filter((r) => Boolean(r.current))
          .every((r) => {
            const closestClassName = classes.some((c) => {
              return target.closest(`.${c}`);
            });

            return (
              r.current && !r.current.contains(target) && !closestClassName
            );
          })
      : ref.current && !ref.current.contains(target);

    if (isOutside) {
      handler(event);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

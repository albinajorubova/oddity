import type { Ref } from "react";

export function composeRefs<T = any>(
  ...refs: Array<Ref<T> | undefined>
): Ref<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        (ref as any).current = node;
      }
    });
  };
}

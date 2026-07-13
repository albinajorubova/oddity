import { useCallback, useRef } from "react";

export function useArrayRefs<T>() {
  // Внутри храним (T | null)[], чтобы не ругаться на null из ref-колбэков
  const refs = useRef<Array<T | null>>([]);

  // Возвращает стабильный колбэк для конкретного индекса
  const getRef = useCallback(
    (index: number) => (el: T | null) => {
      refs.current[index] = el;
    },
    [],
  );

  // Удобный "снимок" без null, если нужно работать только с существующими элементами
  const compact = useCallback(() => refs.current.filter(Boolean) as T[], []);

  return { refs, getRef, compact };
}

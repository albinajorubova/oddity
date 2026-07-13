"use client";

import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PresenceContext } from "../context";
import type { AnimatePresenceProps } from "../types";
import { getChildKey, onlyElements } from "../utils/utils";

/**
 * AnimatePresence — как в framer-motion.
 * Позволяет анимировать выход компонентов при удалении из дерева.
 * Дети должны иметь уникальный `key`.
 *
 * Используйте PresenceChild для CSS-переходов или usePresence для кастомной логики.
 *
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   <PresenceChild key={tab} classNames="fade" timeout={300}>
 *     <div>{content}</div>
 *   </PresenceChild>
 * </AnimatePresence>
 * ```
 */
export function AnimatePresence({
  children,
  mode = "sync",
  onExitComplete,
}: AnimatePresenceProps): ReactNode {
  const presentChildren = useMemo(() => onlyElements(children), [children]);
  const presentKeys = useMemo(
    () => presentChildren.map(getChildKey),
    [presentChildren],
  );

  const pendingPresentChildren = useRef(presentChildren);
  const exitComplete = useRef(new Map<string | number, boolean>());
  const exitingComponents = useRef(new Set<string | number>());

  const [renderedChildren, setRenderedChildren] = useState(presentChildren);
  const prevPresentRef = useRef(presentChildren);

  useLayoutEffect(() => {
    pendingPresentChildren.current = presentChildren;

    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.current.get(key) !== true) {
          exitComplete.current.set(key, false);
        }
      } else {
        exitComplete.current.delete(key);
        exitingComponents.current.delete(key);
      }
    }

    if (presentChildren !== prevPresentRef.current) {
      prevPresentRef.current = presentChildren;
      const nextChildren: ReactElement[] = [...presentChildren];
      const exiting: ReactElement[] = [];

      for (let i = 0; i < renderedChildren.length; i++) {
        const child = renderedChildren[i];
        const key = getChildKey(child);
        if (!presentKeys.includes(key)) {
          nextChildren.splice(i, 0, child);
          exiting.push(child);
        }
      }

      const toRender =
        mode === "wait" && exiting.length > 0
          ? exiting
          : onlyElements(nextChildren);
      setRenderedChildren(toRender);
    }
  }, [presentChildren, presentKeys, renderedChildren, mode]);

  const handleExitComplete = useCallback(
    (key: string | number) => {
      if (exitingComponents.current.has(key)) return;
      exitingComponents.current.add(key);
      exitComplete.current.set(key, true);

      let allComplete = true;
      exitComplete.current.forEach((v) => {
        if (!v) allComplete = false;
      });

      if (allComplete) {
        setRenderedChildren(pendingPresentChildren.current);
        exitingComponents.current.clear();
        exitComplete.current.clear();
        onExitComplete?.();
      }
    },
    [onExitComplete],
  );

  return (
    <>
      {renderedChildren.map((child) => {
        const key = getChildKey(child);
        const isPresent =
          presentChildren === renderedChildren || presentKeys.includes(key);
        const safeToRemove = () => handleExitComplete(key);

        return (
          <PresenceContext.Provider
            key={key}
            value={{ isPresent, safeToRemove }}
          >
            {child}
          </PresenceContext.Provider>
        );
      })}
    </>
  );
}

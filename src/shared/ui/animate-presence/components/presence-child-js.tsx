"use client";

import {
  cloneElement,
  type ReactElement,
  type Ref,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";

import { usePresence } from "../hooks";
import type { PresenceChildJSProps } from "../types";

export function PresenceChildJS({
  children,
  onEnter,
  onLeave,
  onLeaveComplete,
}: PresenceChildJSProps): ReactElement {
  const { isPresent, safeToRemove } = usePresence();
  const nodeRef = useRef<HTMLElement | null>(null);

  const handleComplete = useCallback(
    (_: HTMLElement | null, isVisible: boolean) => {
      if (!isVisible) {
        safeToRemove();
        onLeaveComplete?.(nodeRef.current);
      }
    },
    [safeToRemove],
  );

  useLayoutEffect(() => {
    const rafId = requestAnimationFrame(() => {
      if (isPresent) {
        onEnter?.(nodeRef.current);
      } else {
        onLeave?.(nodeRef.current);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isPresent]);

  return cloneElement(
    children as ReactElement<{
      isVisible?: boolean;
      onComplete?: (element: HTMLElement | null, isVisible: boolean) => void;
      isClearProps?: boolean;
      ref?: Ref<HTMLElement>;
    }>,
    {
      isVisible: isPresent,
      onComplete: handleComplete,
      isClearProps: false,
      ref: nodeRef,
    },
  );
}

import type { ComponentProps } from "react";
import { useCallback, useRef } from "react";

import { useCountValueUpdate } from "@shared/hooks/use-count-value-update";

import type { AnimatePresenceMode } from "../types";
import { AnimatePresence } from "./animate-presence";
import { PresenceChildJS } from "./presence-child-js";

export type SwitchElementProps = ComponentProps<"div"> & {
  transitionKey: string | number;
  children: React.ReactElement;
  mode?: AnimatePresenceMode;
  onEnter?: (ref: HTMLElement | null) => void;
  onLeave?: (ref: HTMLElement | null) => void;
  onLeaveComplete?: (ref: HTMLElement | null) => void;
  /** Вызывается при смене ключа: (входящий узел, уходящий узел). */
  onTransition?: (
    nextNode: HTMLElement | null,
    prevNode: HTMLElement | null,
  ) => void;
};

export const SwitchElement = ({
  transitionKey,
  children,
  mode = "wait",
  onEnter,
  onLeave,
  onLeaveComplete,
  onTransition,
}: SwitchElementProps) => {
  const countListRender = useCountValueUpdate<string | number>(transitionKey);
  const prevNodeRef = useRef<HTMLElement | null>(null);

  const handleLeave = useCallback(
    (ref: HTMLElement | null) => {
      prevNodeRef.current = ref;
      onLeave?.(ref);
    },
    [onLeave],
  );

  const handleEnter = useCallback(
    (ref: HTMLElement | null) => {
      const nextNode = ref;
      const prevNode = prevNodeRef.current;
      prevNodeRef.current = null;
      if (prevNode !== null) {
        onTransition?.(nextNode, prevNode);
      }
      onEnter?.(ref);
    },
    [onEnter, onTransition],
  );

  return (
    <AnimatePresence mode={mode}>
      <PresenceChildJS
        key={`${transitionKey}-${countListRender.current}`}
        onEnter={handleEnter}
        onLeave={handleLeave}
        onLeaveComplete={onLeaveComplete}
      >
        {children}
      </PresenceChildJS>
    </AnimatePresence>
  );
};

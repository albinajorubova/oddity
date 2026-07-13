"use client";

import {
  cloneElement,
  type ReactElement,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { composeRefs } from "@/shared/utils/compose-refs";

import { usePresence } from "../hooks";
import type { PresenceChildCSSProps } from "../types";
import { forceReflow } from "../utils/utils-reflow";

function addClass(node: Element | null | undefined, classes: string): void {
  if (node && classes) {
    classes.split(" ").forEach((c) => {
      node.classList.add(c);
    });
  }
}

function removeClass(node: Element | null | undefined, classes: string): void {
  if (node && classes) {
    classes.split(" ").forEach((c) => {
      node.classList.remove(c);
    });
  }
}

function getClassNames(classNames: string | undefined, type: "enter" | "exit") {
  const prefix = classNames ? `${classNames}-` : "";
  return {
    base: `${prefix}${type}`,
    active: `${prefix}${type}-active`,
  };
}

export function PresenceChildCSS({
  children,
  classNames = "fade",
  timeout = 300,
}: PresenceChildCSSProps): ReactElement {
  const { isPresent, safeToRemove } = usePresence();
  const nodeRef = useRef<Element | null>(null);
  const appliedRef = useRef<{ enter?: string; exit?: string }>({});

  const childRef = (children as ReactElement & { ref?: Ref<Element> }).ref;
  const childWithRef = cloneElement(
    children as ReactElement<{ ref?: Ref<Element> }>,
    {
      ref: composeRefs(nodeRef, childRef),
    },
  );

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (isPresent) {
      removeClass(node, appliedRef.current.exit ?? "");
      appliedRef.current.exit = "";
      const { base, active } = getClassNames(classNames, "enter");
      addClass(node, base);
      forceReflow(node);
      addClass(node, active);
      appliedRef.current.enter = `${base} ${active}`;
    } else {
      removeClass(node, appliedRef.current.enter ?? "");
      appliedRef.current.enter = "";
      const { base, active } = getClassNames(classNames, "exit");
      addClass(node, base);
      forceReflow(node);
      addClass(node, active);
      appliedRef.current.exit = `${base} ${active}`;
    }
  }, [isPresent, classNames]);

  useEffect(() => {
    if (isPresent) return;

    const node = nodeRef.current;
    const exitTimeout =
      typeof timeout === "number" ? timeout : (timeout?.exit ?? 300);

    if (!node) {
      safeToRemove();
      return;
    }

    const handler = (): void => {
      node.removeEventListener("transitionend", handler, false);
      safeToRemove();
    };

    node.addEventListener("transitionend", handler, false);
    const fallback = setTimeout(handler, exitTimeout);
    return () => clearTimeout(fallback);
  }, [isPresent, safeToRemove, timeout]);

  return childWithRef;
}

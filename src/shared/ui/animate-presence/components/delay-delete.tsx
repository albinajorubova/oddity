"use client";

import {
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
} from "react";
import gsap from "gsap";

export type Children =
  | ReactNode
  | ((props: { ref: Ref<HTMLElement>; isVisible: boolean }) => ReactNode);

export type DelayDeleteProps = {
  children: Children;
  timeout?: number;
  ref?: Ref<HTMLElement>;
  isVisible?: boolean;
  onComplete?: (element: HTMLElement | null, isVisible: boolean) => void;
};

export const DelayDelete = ({
  children,
  timeout = 1,
  ref,
  isVisible,
  onComplete,
}: DelayDeleteProps) => {
  useEffect(() => {
    if (!isVisible) {
      const delay = gsap.delayedCall(timeout, () => {
        onComplete?.(null, isVisible ?? false);
      });

      return () => {
        delay.kill();
      };
    }
  }, [isVisible, onComplete]);

  if (typeof children === "function") {
    return children({
      ref: ref as Ref<HTMLElement>,
      isVisible: isVisible ?? false,
    }) as ReactElement;
  }

  return cloneElement(
    children as ReactElement<{
      ref?: Ref<HTMLElement>;
    }>,
    {
      ref,
    },
  );
};

import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";
import useValueUpdate from "@shared/hooks/use-value-update";
import { Slot } from "@shared/ui/slot";
import { composeRefs } from "@shared/utils/compose-refs";
import { gsap } from "gsap";
import { useEffect, useId, useMemo, useRef } from "react";

import { ANIMATES, type AnimationData } from "./animates";

// Types
interface AnimateProps {
  isVisible: boolean;
  isClearProps?: boolean;
  data?: AnimationData | keyof typeof ANIMATES;
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  onComplete?: (element: HTMLElement | null) => void;
  onStart?: () => void;
  animateOnMount?: boolean;
  ref?: React.Ref<HTMLElement>;
}

interface AnimateInViewProps extends Omit<AnimateProps, "isVisible"> {
  children: React.ReactNode;
  threshold?: number;
}

export const Animate = ({
  isVisible,
  isClearProps = true,
  data = {
    set: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  },
  delay = 0,
  duration = 1,
  children,
  onComplete,
  onStart,
  animateOnMount,
  ref,
}: AnimateProps) => {
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const animate = useMemo((): AnimationData => {
    if (typeof data === "string") {
      return ANIMATES[data];
    }
    return data as AnimationData;
  }, [data]);

  // eslint-disable-next-line no-shadow
  const doAnimate = (isAnimate: boolean, animate: AnimationData) => {
    const dir = isAnimate ? "in" : "out";

    const animateProps = {
      ...animate[dir],
    };

    tween.current = gsap.to(rootRef.current, {
      id,
      ...animateProps,
      delay,
      duration,
      overwrite: "auto",
      onStart,
      onComplete: () => {
        if (onComplete) onComplete(rootRef.current);

        if (isClearProps) {
          gsap.set(rootRef.current, {
            clearProps: "all",
          });
        }
      },
    });
  };

  useValueUpdate(() => {
    doAnimate(isVisible, animate);
  }, isVisible);

  useEffect(() => {
    const animated = animateOnMount || isVisible;

    if (animated) {
      doAnimate(animated, animate);
    }

    return () => {
      gsap.getById(id)?.revert();
    };
  }, []); // eslint-disable-line

  return (
    <Slot
      ref={composeRefs(ref, rootRef)}
      style={{
        ...animate.set,
      }}
    >
      {children}
    </Slot>
  );
};

export const AnimateInView = ({
  children,
  threshold = 0,
  ...props
}: AnimateInViewProps) => {
  const [ref, inView] = useIntersectionObserver({
    triggerOnce: true,
    threshold,
  });

  return (
    <Animate ref={ref} isVisible={inView} {...props}>
      {children}
    </Animate>
  );
};

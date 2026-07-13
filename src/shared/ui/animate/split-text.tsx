import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";
import { SplitText } from "@shared/ui/split-text";
import { composeRefs } from "@shared/utils/compose-refs";
import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import s from "./split-text.module.scss";

// Types
interface SplitTextAnimateProps {
  className?: string;
  children: React.ReactNode;
  isVisible: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  type?: "char" | "word";
  ref?: React.Ref<HTMLElement>;
}

interface SplitTextAnimateInViewProps
  extends Omit<SplitTextAnimateProps, "isVisible"> {
  children: React.ReactNode;
}

export const SplitTextAnimate = ({
  className,
  children,
  isVisible,
  stagger = 0.02,
  duration = 1,
  delay = 0,
  as: As = "div",
  type = "char",
  ref,
}: SplitTextAnimateProps) => {
  const rootRef = useRef<HTMLElement>(null);

  const $letters = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef.current);
    $letters.current = q(`.${type}`);
  }, []);

  useEffect(() => {
    const yFrom = isVisible ? 101 : 0;
    const yTo = isVisible ? 0 : -101;

    const tween = gsap.fromTo(
      $letters.current,
      {
        yPercent: yFrom,
      },
      {
        yPercent: yTo,
        ease: "quartInOut",
        stagger,
        duration,
        delay,
        overwrite: "auto",
      },
    );

    return () => {
      tween.revert();
    };
  }, [isVisible, delay, stagger, duration]);

  return (
    <As ref={composeRefs(ref, rootRef)} className={clsx(s.root, className)}>
      <SplitText type={type}>{children}</SplitText>
    </As>
  );
};

export const SplitTextAnimateInView = ({
  children,
  ...props
}: SplitTextAnimateInViewProps) => {
  const [ref, inView] = useIntersectionObserver();

  return (
    <SplitTextAnimate isVisible={inView} ref={ref} {...props}>
      {children}
    </SplitTextAnimate>
  );
};

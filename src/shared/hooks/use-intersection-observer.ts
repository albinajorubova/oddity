import React from "react";

export interface IntersectionObserverOptionsExtended
  extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends Element = HTMLDivElement>(
  options?: IntersectionObserverOptionsExtended,
): [React.RefObject<T | null>, boolean] => {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleObserve: IntersectionObserverCallback = ([entry]) => {
      if (entry) {
        setInView((prev) => {
          if (options?.triggerOnce && prev === true) return prev;
          return entry.isIntersecting;
        });
      }
    };

    const observer = new IntersectionObserver(handleObserve, options);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, inView];
};

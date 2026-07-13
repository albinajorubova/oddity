import { useEffect, useMemo, useRef } from "react";

import { getBoundElement } from "@/shared/utils/get-bound-element";
import { useScroll } from "@/widgets/scroll/hooks/use-scroll";

const defaultPosition: ElementLenisPosition = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  originalY: 0,
};

export type ElementLenisPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  originalY: number;
};

export const useElementLenisPosition = <T extends HTMLElement = HTMLElement>(
  onUpdate?: (bound: ElementLenisPosition) => void,
) => {
  const $root = useRef<T | null>(null);

  const vars = useMemo(
    () => ({
      bound: { ...defaultPosition },
    }),
    [],
  );

  const scrollLenis = useScroll();
  useEffect(() => {
    if (!scrollLenis) return;

    const scrollElement = scrollLenis.rootElement;

    const onScroll = () => {
      vars.bound.y = vars.bound.originalY - scrollElement.scrollTop;
      onUpdate?.(vars.bound);
    };

    const onResize = () => {
      vars.bound = { ...getBoundElement($root), originalY: 0 };
      vars.bound.originalY = vars.bound.y + scrollElement.scrollTop;

      onScroll();
    };

    scrollElement.addEventListener("resize-scroll", onResize);
    scrollLenis.on("scroll", onScroll);

    return () => {
      scrollElement.removeEventListener("resize-scroll", onResize);
      scrollLenis.off("scroll", onScroll);
    };
  }, [scrollLenis]);

  return $root;
};

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis, { type LenisOptions } from "lenis";

import { DEFAULT_SCROLL_OPTIONS } from "../constants";

export const useCreateScroll = (
  root: boolean,
  wrapper: boolean,
  options: ScrollOptions,
) => {
  const [scroll, setScroll] = useState<Lenis | null>(null);

  const wrapRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const args: LenisOptions = {
      eventsTarget: document.body,
      ...DEFAULT_SCROLL_OPTIONS,
      ...options,
    };

    if (wrapper && wrapRef.current && contentRef.current) {
      args.wrapper = wrapRef.current;
      args.content = contentRef.current;
    }

    const lenis = new Lenis({ ...args });

    if (root) {
      window.__GLOBAL_SCROLL__ = lenis;
    }

    setScroll(lenis);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [root]);

  return [scroll, wrapRef, contentRef];
};

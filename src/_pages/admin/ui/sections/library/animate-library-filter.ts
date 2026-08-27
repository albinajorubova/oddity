import { gsap } from "gsap";

export const LIBRARY_FILTER_TRANSITION = 0.5;

export const animateLibraryFilterEnter = (node: HTMLElement | null) => {
  if (!node) return;

  gsap.killTweensOf(node);
  gsap.set(node, { transition: "none" });
  gsap.fromTo(
    node,
    { opacity: 0, filter: "blur(8em)" },
    {
      opacity: 1,
      filter: "blur(0em)",
      duration: LIBRARY_FILTER_TRANSITION,
      ease: "power2.inOut",
      clearProps: "filter,opacity,transition",
    },
  );
};

export const animateLibraryFilterLeave = (node: HTMLElement | null) => {
  if (!node) return;

  gsap.killTweensOf(node);
  gsap.set(node, { transition: "none" });
  gsap.to(node, {
    opacity: 0,
    filter: "blur(8em)",
    duration: LIBRARY_FILTER_TRANSITION,
    ease: "power2.inOut",
  });
};

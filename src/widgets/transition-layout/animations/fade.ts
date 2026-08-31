import { gsap } from "gsap";

import { TRANSITION_DURATION } from "../constants";
import type { TransitionAnimation, TransitionAnimationParams } from "./types";

/** Fallback: простой crossfade между страницами */
export const fadeTransition: TransitionAnimation = {
  id: "fade",

  onLeave: ({ prevNode, nextNode, onComplete }: TransitionAnimationParams) => {
    if (prevNode) {
      gsap.set(prevNode, { pointerEvents: "none" });
    }

    const tl = gsap.timeline({ onComplete });

    if (nextNode) {
      gsap.set(nextNode, { opacity: 0 });
      tl.to(
        nextNode,
        {
          opacity: 1,
          duration: TRANSITION_DURATION.FADE,
          ease: "power1.inOut",
        },
        0,
      );
    }

    if (prevNode) {
      tl.to(
        prevNode,
        {
          opacity: 0,
          duration: TRANSITION_DURATION.FADE,
          ease: "power1.inOut",
        },
        0,
      );
    }

    if (!prevNode && !nextNode) {
      onComplete();
      return undefined;
    }

    return tl;
  },
};

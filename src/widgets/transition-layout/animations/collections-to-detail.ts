import {
  historyScroll,
  historyScrollRef,
} from "@widgets/scroll/coreHooks/use-history-scroll-position";
import { gsap } from "gsap";

import { TRANSITION_DURATION } from "../constants";
import { EVENTS_TRANSITION_LAYOUT, transitionLayoutEmitter } from "../emmiter";
import { transitionStyles as s } from "./styles";
import type { TransitionAnimation, TransitionAnimationParams } from "./types";

const applyScrollFreeze = (mains: HTMLElement[]) => {
  const scrollY = window.__GLOBAL_SCROLL__?.scroll ?? 0;
  const shift = historyScrollRef.scrollPopstate
    ? (historyScroll.get(window.location.pathname) ?? scrollY)
    : scrollY;

  for (const main of mains) {
    const firstChild = main.children[0] as HTMLElement | undefined;
    if (!firstChild) continue;
    firstChild.style.setProperty("--transition-scroll-freeze", `${-shift}px`);
    firstChild.classList.add(s.scrollFreeze);
  }

  const clear = () => {
    for (const main of mains) {
      const firstChild = main.children[0] as HTMLElement | undefined;
      if (!firstChild) continue;
      firstChild.classList.remove(s.scrollFreeze);
      firstChild.style.removeProperty("--transition-scroll-freeze");
    }
    transitionLayoutEmitter.off(EVENTS_TRANSITION_LAYOUT.resetScroll, clear);
  };

  transitionLayoutEmitter.on(EVENTS_TRANSITION_LAYOUT.resetScroll, clear);
};

/**
 * Collections gallery card → collection detail hero (оба DOM живы в sync).
 */
export const collectionsToDetailTransition: TransitionAnimation = {
  id: "collections-to-detail",

  onLeave: ({
    prevNode,
    nextNode,
    slug,
    onComplete,
  }: TransitionAnimationParams) => {
    if (!prevNode || !nextNode || !slug) {
      onComplete();
      return undefined;
    }

    const card = prevNode.querySelector<HTMLElement>(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );
    const hero = nextNode.querySelector<HTMLElement>(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );

    if (!card || !hero) {
      onComplete();
      return undefined;
    }

    applyScrollFreeze([prevNode]);

    const cardRect = card.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    if (heroRect.width < 2 || heroRect.height < 2) {
      onComplete();
      return undefined;
    }

    window.__GLOBAL_SCROLL__?.scrollTo(0, { immediate: true, force: true });

    const dx = cardRect.left - heroRect.left;
    const dy = cardRect.top - heroRect.top;
    const sx = cardRect.width / heroRect.width;
    const sy = cardRect.height / heroRect.height;

    card.classList.add(s.isHidden);
    prevNode.classList.add(s.pageOut);
    nextNode.classList.add(s.pageIn);
    nextNode.classList.remove(s.pageEnter);
    gsap.set(nextNode, { opacity: 1 });

    hero.classList.add(s.flipFlying);
    gsap.set(hero, {
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      transformOrigin: "top left",
      force3D: true,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(hero, { clearProps: "transform" });
        hero.classList.remove(s.flipFlying);
        nextNode.classList.remove(s.pageIn);
        prevNode.classList.remove(s.pageOut);
        card.classList.remove(s.isHidden);
        onComplete();
      },
    });

    tl.to(
      prevNode,
      {
        opacity: 0,
        duration: TRANSITION_DURATION.FADE,
        ease: "power1.out",
      },
      0,
    );

    tl.to(
      hero,
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: TRANSITION_DURATION.MORPH,
        ease: "power2.inOut",
      },
      0,
    );

    return tl;
  },
};

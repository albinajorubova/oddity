import { gsap } from "gsap";

import { historyScroll } from "@widgets/scroll/coreHooks/use-history-scroll-position";

import { TRANSITION_DURATION } from "../constants";
import { EVENTS_TRANSITION_LAYOUT, transitionLayoutEmitter } from "../emmiter";
import { transitionStyles as s } from "./styles";
import type { TransitionAnimation, TransitionAnimationParams } from "./types";

/**
 * Archive hero → home gallery card.
 *
 * nextNode стартует с .pageEnter (opacity: 0).
 * Сначала card → rect hero, потом снимаем pageEnter — без мигания сетки.
 */
export const archiveToHomeTransition: TransitionAnimation = {
  id: "archive-to-home",

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

    const hero = prevNode.querySelector<HTMLElement>(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );
    const card = nextNode.querySelector<HTMLElement>(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );

    if (!hero || !card) {
      nextNode.classList.remove(s.pageEnter);
      gsap.set(nextNode, { opacity: 1 });
      onComplete();
      return undefined;
    }

    const homeY = historyScroll.get("/") ?? 0;
    window.__GLOBAL_SCROLL__?.scrollTo(homeY, {
      immediate: true,
      force: true,
    });

    const firstChild = nextNode.children[0] as HTMLElement | undefined;
    if (firstChild) {
      firstChild.style.setProperty(
        "--transition-scroll-freeze",
        `${-homeY}px`,
      );
      firstChild.classList.add(s.scrollFreeze);
    }

    const clear = () => {
      if (firstChild) {
        firstChild.classList.remove(s.scrollFreeze);
        firstChild.style.removeProperty("--transition-scroll-freeze");
      }
      transitionLayoutEmitter.off(EVENTS_TRANSITION_LAYOUT.resetScroll, clear);
    };
    transitionLayoutEmitter.on(EVENTS_TRANSITION_LAYOUT.resetScroll, clear);

    const heroRect = hero.getBoundingClientRect();
    let cardRect = card.getBoundingClientRect();

    if (
      cardRect.bottom < 0 ||
      cardRect.top > window.innerHeight ||
      cardRect.width < 2
    ) {
      const lenis = window.__GLOBAL_SCROLL__;
      if (lenis) {
        const nextY =
          lenis.scroll +
          cardRect.top -
          window.innerHeight / 2 +
          cardRect.height / 2;
        lenis.scrollTo(Math.max(0, nextY), { immediate: true, force: true });
        if (firstChild) {
          firstChild.style.setProperty(
            "--transition-scroll-freeze",
            `${-lenis.scroll}px`,
          );
        }
        cardRect = card.getBoundingClientRect();
      }
    }

    if (cardRect.width < 2 || heroRect.width < 2) {
      nextNode.classList.remove(s.pageEnter);
      gsap.set(nextNode, { opacity: 1 });
      onComplete();
      return undefined;
    }

    const dx = heroRect.left - cardRect.left;
    const dy = heroRect.top - cardRect.top;
    const sx = heroRect.width / cardRect.width;
    const sy = heroRect.height / cardRect.height;

    prevNode.classList.add(s.pageOut);
    nextNode.classList.add(s.pageIn);

    card.classList.add(s.flipFlying);
    gsap.set(card, {
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      transformOrigin: "top left",
      force3D: true,
    });

    nextNode.classList.remove(s.pageEnter);
    gsap.set(nextNode, { opacity: 1 });
    hero.classList.add(s.isHidden);

    const info = prevNode.querySelector<HTMLElement>("[data-archive-hero-info]");
    if (info) {
      gsap.to(info, {
        opacity: 0,
        y: -8,
        duration: 0.18,
        ease: "power1.in",
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(card, { clearProps: "transform" });
        card.classList.remove(s.flipFlying);
        nextNode.classList.remove(s.pageIn);
        prevNode.classList.remove(s.pageOut);
        hero.classList.remove(s.isHidden);
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
      card,
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

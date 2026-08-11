"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";

gsap.registerPlugin(Flip);

export type LabFlipApi = {
  activeSlug: string | null;
  isOpen: boolean;
  open: (slug: string) => void;
  close: () => void;
  heroCopyRef: React.RefObject<HTMLDivElement | null>;
};

type FlipDirection = "open" | "close";

const FLIP_VARS = {
  duration: 0.65,
  ease: "power2.inOut",
  absolute: true,
  scale: true,
} as const;

/**
 * Этапы 2–3 — open / close.
 *
 * Почему open и close раньше выглядели по-разному:
 * - close анимировал CARD (в сетке сверху) → полёт через экран виден
 * - open анимировал HERO (внизу в .heroSlot с overflow:hidden) → полёт обрезался
 *
 * Фикс open: летает та же CARD через Flip.fit(card, hero), потом swap видимости.
 */
export const useLabFlip = (): LabFlipApi => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const directionRef = useRef<FlipDirection | null>(null);
  const closingSlugRef = useRef<string | null>(null);
  const mutatingRef = useRef(false);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);

  const open = (slug: string) => {
    if (mutatingRef.current) return;

    if (slug === activeSlug) {
      close();
      return;
    }

    if (activeSlug) return;

    mutatingRef.current = true;
    directionRef.current = "open";
    // Для open снимок не нужен — используем Flip.fit(card → hero)
    flipStateRef.current = null;
    setActiveSlug(slug);
  };

  const close = () => {
    if (mutatingRef.current) return;
    if (!activeSlug) return;

    mutatingRef.current = true;
    const slug = activeSlug;

    const finishSnapshotAndClose = () => {
      // FIRST: hero (откуда улетаем)
      flipStateRef.current = Flip.getState(
        `[data-flip-id="${slug}"][data-flip-role="hero"]`,
      );
      directionRef.current = "close";
      closingSlugRef.current = slug;
      setActiveSlug(null);
    };

    const copy = heroCopyRef.current;
    if (copy) {
      gsap.to(copy, {
        opacity: 0,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: finishSnapshotAndClose,
      });
    } else {
      finishSnapshotAndClose();
    }
  };

  useLayoutEffect(() => {
    const direction = directionRef.current;
    if (!direction) return;

    directionRef.current = null;

    // ---------- OPEN: летает CARD → к размеру/позиции hero ----------
    if (direction === "open" && activeSlug) {
      const card = document.querySelector<HTMLElement>(
        `[data-flip-id="${activeSlug}"][data-flip-role="card"]`,
      );
      const hero = document.querySelector<HTMLElement>(
        `[data-flip-id="${activeSlug}"][data-flip-role="hero"]`,
      );
      const emptySlot = document.querySelector<HTMLElement>(
        `[data-lab-card][data-slug="${activeSlug}"] [data-slot-empty]`,
      );

      if (!card || !hero) {
        mutatingRef.current = false;
        return;
      }

      // Пока летим — показываем card (она вверху экрана), hero мерим, но не видим
      card.hidden = false;
      if (emptySlot) emptySlot.hidden = true;
      gsap.set(hero, { autoAlpha: 0 });
      gsap.set(card, { zIndex: 20 });

      const otherCards = gsap.utils
        .toArray<HTMLElement>("[data-lab-card]")
        .filter((el) => el.dataset.slug !== activeSlug);

      gsap.to(otherCards, {
        opacity: 0.25,
        duration: 0.35,
        ease: "power2.out",
      });

      const copy = heroCopyRef.current;
      if (copy) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: 0.3,
            ease: "power2.out",
          },
        );
      }

      // Card «долетает» до hero (полёт виден через весь экран)
      Flip.fit(card, hero, {
        ...FLIP_VARS,
        onComplete: () => {
          gsap.set(card, { clearProps: "all" });
          card.hidden = true;
          if (emptySlot) emptySlot.hidden = false;
          gsap.set(hero, { clearProps: "opacity,visibility" });
          mutatingRef.current = false;
        },
      });
      return;
    }

    // ---------- CLOSE: FIRST был hero → Flip на CARD ----------
    if (direction === "close" && !activeSlug) {
      const state = flipStateRef.current;
      flipStateRef.current = null;

      const slug = closingSlugRef.current;
      closingSlugRef.current = null;

      if (!state || !slug) {
        mutatingRef.current = false;
        return;
      }

      const card = document.querySelector<HTMLElement>(
        `[data-flip-id="${slug}"][data-flip-role="card"]`,
      );

      gsap.to("[data-lab-card]", {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      if (card) gsap.set(card, { zIndex: 20 });

      Flip.from(state, {
        ...FLIP_VARS,
        targets: card ? [card] : undefined,
        onComplete: () => {
          if (card) gsap.set(card, { clearProps: "all" });
          mutatingRef.current = false;
        },
      });
    }
  }, [activeSlug]);

  return {
    activeSlug,
    isOpen: activeSlug !== null,
    open,
    close,
    heroCopyRef,
  };
};

import { gsap } from "gsap";

import type { StackSlot } from "./slots";

export type ResolvedSlot = StackSlot;

type AnimateStackOptions = {
  cards: HTMLElement[];
  activeIndex: number;
  previousActiveIndex?: number;
  slots: StackSlot[];
  immediate?: boolean;
};

const modulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

/** Rotate cards through the four fixed vertical slots. */
export const resolveSlot = (
  index: number,
  activeIndex: number,
  cardCount: number,
  slots: StackSlot[],
): ResolvedSlot => {
  const fallback = {
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    rotation: 0,
    brightness: 1,
    zIndex: 1,
  };
  const depth = modulo(index - activeIndex, cardCount);
  const slotIndex =
    depth === 0 ? slots.length - 1 : Math.min(depth - 1, slots.length - 2);
  const slot = slots[slotIndex] ?? slots.at(-1) ?? fallback;

  return slot;
};

const slotProps = (slot: ResolvedSlot) => ({
  xPercent: slot.xPercent,
  yPercent: slot.yPercent,
  scale: slot.scale,
  rotation: slot.rotation,
  filter: `brightness(${slot.brightness})`,
});

/**
 * Cinematic depth transition:
 * the outgoing card first recedes, layers cross, then the incoming card
 * settles at full scale and brightness.
 */
export const animateStack = ({
  cards,
  activeIndex,
  previousActiveIndex = activeIndex,
  slots,
  immediate = false,
}: AnimateStackOptions) => {
  const cardCount = cards.length;
  if (!cardCount) return null;

  if (immediate) {
    cards.forEach((card, index) => {
      const slot = resolveSlot(index, activeIndex, cardCount, slots);
      gsap.killTweensOf(card);
      gsap.set(card, {
        ...slotProps(slot),
        zIndex: slot.zIndex,
        transformOrigin: "center center",
      });
    });
    return null;
  }

  const outgoingCard = cards[previousActiveIndex];
  const outgoingSlot = resolveSlot(
    previousActiveIndex,
    activeIndex,
    cardCount,
    slots,
  );
  const layerSwapAt = 0.34;
  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
  });

  cards.forEach((card) => {
    gsap.killTweensOf(card);
  });

  if (outgoingCard && previousActiveIndex !== activeIndex) {
    tl.to(
      outgoingCard,
      {
        scale: Math.min(outgoingSlot.scale + 0.015, 0.97),
        filter: `brightness(${outgoingSlot.brightness})`,
        duration: layerSwapAt,
        ease: "power2.inOut",
      },
      0,
    );
  }

  cards.forEach((card, index) => {
    const slot = resolveSlot(index, activeIndex, cardCount, slots);
    const isIncoming = index === activeIndex;
    const isOutgoing = index === previousActiveIndex;
    const depthDelay = modulo(index - activeIndex, cardCount) * 0.035;

    tl.set(card, { zIndex: slot.zIndex }, layerSwapAt);

    if (isIncoming) {
      tl.to(
        card,
        {
          ...slotProps(slot),
          scale: 1.012,
          filter: "brightness(1.02)",
          duration: 0.92,
          ease: "power4.inOut",
        },
        0.08,
      );
      tl.to(
        card,
        {
          scale: slot.scale,
          filter: `brightness(${slot.brightness})`,
          duration: 0.32,
          ease: "sine.out",
        },
        0.88,
      );
      return;
    }

    tl.to(
      card,
      {
        ...slotProps(slot),
        duration: isOutgoing ? 0.78 : 0.88,
        ease: "power3.inOut",
      },
      layerSwapAt + (isOutgoing ? 0 : depthDelay),
    );
  });

  return tl;
};

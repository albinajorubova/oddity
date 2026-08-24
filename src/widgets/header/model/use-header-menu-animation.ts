"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";

import useValueUpdate from "@shared/hooks/use-value-update";

export const useHeaderMenuAnimation = (isOpenMenu: boolean) => {
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);

  const animateMenu = useCallback((open: boolean) => {
    const overlayEl = menuOverlayRef.current;
    const panelEl = menuPanelRef.current;
    const backdropEl = backdropRef.current;
    if (!overlayEl || !panelEl || !backdropEl) return;

    const items = panelEl.querySelectorAll<HTMLElement>(
      "[data-header-nav-item]",
    );

    const tl = gsap.timeline();

    if (open) {
      tl.set(overlayEl, { pointerEvents: "auto" }, 0);
    }

    tl.set(
      items,
      {
        "--close-item": open ? 0 : 1,
        delay: open ? 0.25 : 0,
      },
      0,
    );

    tl.to(
      backdropEl,
      {
        opacity: open ? 1 : 0,
        duration: open ? 0.45 : 0.3,
        ease: open ? "power2.out" : "power2.in",
      },
      0,
    );

    if (!open) {
      tl.set(overlayEl, { pointerEvents: "none" }, ">");
    }

    return () => {
      tl.kill();
    };
  }, []);

  useValueUpdate(animateMenu, isOpenMenu);

  return { menuOverlayRef, menuPanelRef, backdropRef };
};

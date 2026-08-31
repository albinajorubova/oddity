"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUiActions, useUiStore } from "@app/model/ui-store";
import clsx from "clsx";
import { useRouter } from "next/router";

import { ROUTES, setRandomHoverBlotch } from "@shared/config";
import { BgMorph } from "@shared/ui/bg-morph";
import { Button } from "@shared/ui/button";
import { Container } from "@shared/ui/container";
import { OddLogo } from "@shared/ui/odd-logo";
import { RollingText } from "@shared/ui/rolling-text";

import { useHeaderMenuAnimation } from "./model/use-header-menu-animation";
import { Burger } from "./ui/burger";
import { HeaderMenuPanel } from "./ui/header-menu-panel";

import s from "./header.module.scss";

export type HeaderProps = ComponentProps<"header"> & {
  className?: string;
};

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;
  const router = useRouter();
  const isHome = router.pathname === ROUTES.home;
  const isOpenMenu = useUiStore((store) => store.isOpenMenu);
  const { toggleMenu, closeMenu } = useUiActions();
  const { menuOverlayRef, menuPanelRef, backdropRef } =
    useHeaderMenuAnimation(isOpenMenu);

  const isOpenMenuRef = useRef(isOpenMenu);
  isOpenMenuRef.current = isOpenMenu;

  const [isMenuElevated, setIsMenuElevated] = useState(false);

  useEffect(() => {
    if (isOpenMenu) setIsMenuElevated(true);
  }, [isOpenMenu]);

  const onMenuMorphComplete = useCallback((isOpenAnimation: boolean) => {
    if (!isOpenAnimation && !isOpenMenuRef.current) {
      setIsMenuElevated(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpenMenu) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, isOpenMenu]);

  useEffect(() => {
    router.events.on("routeChangeStart", closeMenu);
    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [closeMenu, router.events]);

  return (
    <>
      <header
        className={clsx(s.root, isMenuElevated && s.isMenuOpen, className)}
        {...rest}
      >
        <Container className={s.bar}>
          <nav className={s.nav} aria-label="Primary">
            <div className={s.logoSlot}>
              <Button
                href={ROUTES.home}
                data-header-logo
                className={clsx(
                  s.headerLogo,
                  isHome && s.isHomeHidden,
                  !isHome && s.isStaticVisible,
                )}
                aria-label="ODDITY"
              >
                <OddLogo
                  text="ODDITY"
                  className="typo-p1"
                  introDelayMs={0}
                  idle={isHome}
                />
              </Button>
            </div>
          </nav>

          <Button
            href={ROUTES.search}
            className={clsx(s.search, "typo-caption")}
            aria-label="Search"
            onMouseEnter={setRandomHoverBlotch}
          >
            <span className={s.searchDot} aria-hidden />
            <RollingText text="SEARCH" />
          </Button>

          <div className={s.actions}>
            <Burger isOpen={isOpenMenu} onClick={toggleMenu} />
          </div>
        </Container>
      </header>

      <div
        id="header-menu"
        ref={menuOverlayRef}
        className={s.menuOverlay}
        data-open={isMenuElevated ? "" : undefined}
        aria-hidden={!isOpenMenu}
      >
        <button
          ref={backdropRef}
          type="button"
          className={s.menuBackdrop}
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
        <nav ref={menuPanelRef} className={s.menuPanel} aria-label="Menu">
          <BgMorph
            duration={0.6}
            uniqSvgId="header-menu-bg-morph"
            isOpen={isOpenMenu}
            direction="top"
            onComplete={onMenuMorphComplete}
          />
          <Container>
            <HeaderMenuPanel onNavigate={closeMenu} />
          </Container>
        </nav>
      </div>
    </>
  );
};

Header.displayName = "Header";

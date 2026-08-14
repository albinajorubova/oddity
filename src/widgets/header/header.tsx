"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

import { ROUTES, setRandomHoverBlotch } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Container } from "@shared/ui/container";
import { OddLogo } from "@shared/ui/odd-logo";
import { RollingText } from "@shared/ui/rolling-text";

// import { Link } from "@shared/ui/link";
// import { MarkerHighlight } from "@shared/ui/marker";
// import { HOME_NAV_STUB } from "@/_pages/home/model";

import { Burger } from "./ui/burger";

import s from "./header.module.scss";

export type HeaderProps = ComponentProps<"header"> & {
  className?: string;
};

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;
  const router = useRouter();
  const isHome = router.pathname === ROUTES.home;

  return (
    <Container tag="header" className={clsx(s.root, className)} {...rest}>
      <nav className={s.nav} aria-label="Primary">
        <div className={s.logoSlot}>
          <Button
            href={ROUTES.home}
            data-header-logo
            className={clsx(s.headerLogo, !isHome && s.isVisible)}
            aria-label="ODDITY"
          >
            <OddLogo
              text="ODDITY"
              className={s.headerLogoInner}
              introDelayMs={0}
            />
          </Button>
        </div>

        {/* {HOME_NAV_STUB.map((item) => (
          <Link key={item.label} href={item.href} className={s.navLink}>
            <MarkerHighlight color="lime" variant="background">
              {item.label}
            </MarkerHighlight>
          </Link>
        ))} */}
      </nav>

      <Button
        href={ROUTES.search}
        className={s.search}
        aria-label="Search"
        onMouseEnter={setRandomHoverBlotch}
      >
        <span className={s.searchDot} aria-hidden />
        <RollingText text="SEARCH" />
      </Button>

      <div className={s.actions}>
        {/* <Link href={ROUTES.login} className={s.login}>
          <MarkerHighlight color="lime" variant="background">
            LOGIN
          </MarkerHighlight>
        </Link>
        <Button href={ROUTES.join} className={s.join}>
          JOIN ↗
        </Button> */}

        <Burger />
      </div>
    </Container>
  );
};

Header.displayName = "Header";

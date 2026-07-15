"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { setRandomHoverBlotch } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Container } from "@shared/ui/container";
import { Link } from "@shared/ui/link";
import { MarkerHighlight } from "@shared/ui/marker";
import { HOME_NAV_STUB } from "@/_pages/home/model";

import s from "./header.module.scss";

export type HeaderProps = ComponentProps<"header"> & {
  className?: string;
};

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;

  return (
    <Container tag="header" className={clsx(s.root, className)} {...rest}>
      <nav className={s.nav} aria-label="Primary">
        {HOME_NAV_STUB.map((item) => (
          <Link key={item.href} href={item.href} className={s.navLink}>
            <MarkerHighlight color="lime" variant="background">
              {item.label}
            </MarkerHighlight>
          </Link>
        ))}
      </nav>

      <Button
        href="/search"
        className={s.search}
        aria-label="Search"
        onMouseEnter={setRandomHoverBlotch}
      >
        <span className={s.searchDot} aria-hidden />
        <span>SEARCH</span>
      </Button>

      <div className={s.actions}>
        <Link href="/login" className={s.login}>
          <MarkerHighlight color="lime" variant="background">
            LOGIN
          </MarkerHighlight>
        </Link>
        <Button href="/join" className={s.join}>
          JOIN ↗
        </Button>
      </div>
    </Container>
  );
};

Header.displayName = "Header";

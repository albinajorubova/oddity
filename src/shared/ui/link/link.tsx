import type React from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";

import s from "./link.module.scss";

export type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "onMouseEnter" | "onMouseLeave"
> & {
  className?: string;
  children: React.ReactNode;
  variant?: "underline" | "text" | "button";
  size?: ElementSize;
  href: string;
  disabled?: boolean;
};

export const Link = (props: LinkProps) => {
  const {
    className,
    href,
    children,
    variant = "text",
    size = "s",
    disabled,
    target,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const mods = mod(s, {
    variant,
    size,
  });

  const typoClass =
    size === "l" || size === "xl" ? "typo-h3" : "typo-caption";

  return (
    <Button
      disabled={disabled}
      className={clsx(s.root, typoClass, className, mods)}
      href={href}
      target={target}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  );
};

Link.displayName = "Link";

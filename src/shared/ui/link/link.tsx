import type React from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";

import s from "./link.module.scss";

export type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target"
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
  } = props;

  const mods = mod(s, {
    variant,
    size,
  });

  return (
    <Button
      disabled={disabled}
      className={clsx(s.root, className, mods)}
      href={href}
      target={target}
    >
      {children}
    </Button>
  );
};

Link.displayName = "Link";

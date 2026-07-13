"use client";

import { useMemo } from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button, type ButtonProps } from "@shared/ui/button";
import { Icon, type IconName } from "@shared/ui/icon";
import { mod } from "@shared/utils/css-mods";

import s from "./styled-button.module.scss";

export type StyledButtonProps = ButtonProps & {
  className?: string;
  variant: "primary" | "secondary" | "icon" | "icon-round";
  size: ElementSize;
  colorScheme?: "gray" | "white" | "light" | "dark";
  icon?: IconName;
  href?: string;
};

export const StyledButton = (props: StyledButtonProps) => {
  const {
    className,
    children,
    variant = "icon",
    colorScheme = "white",
    size = "m",
    icon,
    disabled,
    href,
  } = props;

  const mods = mod(s, { size, variant, colorScheme });

  const iconSize: ElementSize = useMemo(() => {
    switch (variant) {
      case "primary":
        return "l";
      default:
        return "s";
    }
  }, [variant]);

  return (
    <Button
      disabled={disabled}
      className={clsx(s.root, mods, className)}
      href={href}
    >
      {children && (
        <span className={s.bodyWrap}>
          <span className={s.body}>{children}</span>
        </span>
      )}
      {icon && (
        <span className={s.iconWrap}>
          <Icon size={iconSize} name={icon} />
        </span>
      )}
    </Button>
  );
};

StyledButton.displayName = "StyledButton";

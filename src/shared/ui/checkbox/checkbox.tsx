"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { Icon } from "@shared/ui/icon";
import { mod } from "@shared/utils";

import s from "./checkbox.module.scss";

export type CheckboxProps = Omit<
  ComponentProps<"input">,
  "type" | "className"
> & {
  className?: string;
  children?: React.ReactNode;
  variant?: "base" | "switcher";
};

export const Checkbox = (props: CheckboxProps) => {
  const { className, children, variant = "base", ...rest } = props;

  const mods = mod(s, { variant });

  return (
    <div className={clsx(s.root, mods, className)}>
      <input className={s.input} type="checkbox" {...rest} />
      <div className={s.icon}>
        <Icon name="check" size="s" />
      </div>
      {children && <div className={s.content}>{children}</div>}
    </div>
  );
};

Checkbox.displayName = "Checkbox";

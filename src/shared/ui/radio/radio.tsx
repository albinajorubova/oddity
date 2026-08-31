"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { mod } from "@shared/utils";

import s from "./radio.module.scss";

export type RadioProps = Omit<ComponentProps<"input">, "type" | "className"> & {
  className?: string;
  children?: React.ReactNode;
  variant?: "base" | "switcher";
};

export const Radio = (props: RadioProps) => {
  const { className, children, variant = "base", ...rest } = props;

  const mods = mod(s, { variant });

  return (
    <div className={clsx(s.root, mods, className)}>
      <input className={s.input} type="radio" {...rest} />
      <div className={s.icon} />
      {children && (
        <div className={clsx(s.content, "typo-caption")}>{children}</div>
      )}
    </div>
  );
};

Radio.displayName = "Radio";

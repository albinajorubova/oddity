"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";

import s from "./header.module.scss";

export type HeaderProps = ComponentProps<"div"> & {
  className?: string;
};

export const Header = (props: HeaderProps) => {
  const { className } = props;

  return (
    <div className={clsx(s.root, className)}>
      <Button href="/">home</Button>
      <Button href="/about">About</Button>
    </div>
  );
};

Header.displayName = "Header";

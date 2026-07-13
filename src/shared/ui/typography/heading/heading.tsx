import { mod } from "@shared/utils";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

import type { ComponentOrTag } from "@/shared/types";

import type { TypographyProps } from "../typography";
import { Typography } from "../typography";

import styles from "./heading.module.scss";

export type HeadingProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = {
  level: "accentXXL" | "accentM" | "1" | "2" | "3" | "4" | "5";
} & TypographyProps<Element>;

export const Heading = <
  Element extends ComponentOrTag<ComponentProps<Element>>,
>(
  props: HeadingProps<Element>,
) => {
  const {
    level = "1",
    className,
    children,
    weight = "semiBold",
    ...restProps
  } = props as HeadingProps<"span">;

  const mods = mod(styles, {
    level,
  });

  return (
    <Typography
      className={clsx(styles.root, mods, className)}
      weight={weight}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

Heading.displayName = "Heading";

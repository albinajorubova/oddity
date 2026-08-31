import type { ComponentProps } from "react";
import { clsx } from "clsx";

import type { ComponentOrTag } from "@/shared/types";

import type { TypographyProps } from "../typography";
import { Typography } from "../typography";

export type HeadingLevel = "display" | "1" | "2" | "3";

export type HeadingProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = {
  level?: HeadingLevel;
} & TypographyProps<Element>;

const TYPO_BY_LEVEL: Record<HeadingLevel, string> = {
  display: "typo-display",
  "1": "typo-h1",
  "2": "typo-h2",
  "3": "typo-h3",
};

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

  return (
    <Typography
      className={clsx(TYPO_BY_LEVEL[level], className)}
      weight={weight}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

Heading.displayName = "Heading";

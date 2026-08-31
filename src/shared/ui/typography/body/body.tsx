import type { ComponentProps } from "react";
import { clsx } from "clsx";

import type { ComponentOrTag } from "@/shared/types";

import type { TypographyProps } from "../typography";
import { Typography } from "../typography";

export type BodySizeType = "p1" | "p2" | "caption";

export type BodyProps<Element extends ComponentOrTag<ComponentProps<Element>>> =
  TypographyProps<Element> & {
    size?: BodySizeType;
  };

const TYPO_BY_SIZE: Record<BodySizeType, string> = {
  p1: "typo-p1",
  p2: "typo-p2",
  caption: "typo-caption",
};

export const Body = <Element extends ComponentOrTag<ComponentProps<Element>>>(
  props: BodyProps<Element>,
) => {
  const {
    className,
    children,
    size = "p1",
    weight = "medium",
    ...restProps
  } = props as BodyProps<"span">;

  return (
    <Typography
      className={clsx(TYPO_BY_SIZE[size], className)}
      weight={weight}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

Body.displayName = "Body";

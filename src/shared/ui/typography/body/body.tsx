import { mod } from "@shared/utils";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

import type { ComponentOrTag } from "@/shared/types";

import type { TypographyProps } from "../typography";
import { Typography } from "../typography";

import styles from "./body.module.scss";

export type BodySizeType = "primary" | "secondary" | "small";

export type BodyProps<Element extends ComponentOrTag<ComponentProps<Element>>> =
  TypographyProps<Element> & {
    size?: BodySizeType;
  };

export const Body = <Element extends ComponentOrTag<ComponentProps<Element>>>(
  props: BodyProps<Element>,
) => {
  const {
    className,
    children,
    size = "primary",
    weight = "medium",
    ...restProps
  } = props as BodyProps<"span">;

  const mods = mod(styles, { size });

  return (
    <Typography
      className={clsx(styles.root, size, className)}
      weight={weight}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

Body.displayName = "Body";

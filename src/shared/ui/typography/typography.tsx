import { mod } from "@shared/utils";
import clsx from "clsx";
import type { ComponentProps } from "react";

import type { ComponentOrTag, DynamicProps } from "@/shared/types";

import styles from "./typography.module.scss";

export type TypographyProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = DynamicProps<Element> & {
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  color?: "primary" | "secondary" | "inherit";
};

export const Typography = <
  Element extends ComponentOrTag<ComponentProps<Element>>,
>(
  props: TypographyProps<Element>,
) => {
  const {
    children,
    className,
    tag: Component = "span",
    weight = "regular",
    color = "inherit",
    ...restProps
  } = props as TypographyProps<"span">;

  const mods = mod(styles, {
    weight,
    color,
  });

  return (
    <Component className={clsx(className, styles.root, mods)} {...restProps}>
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";

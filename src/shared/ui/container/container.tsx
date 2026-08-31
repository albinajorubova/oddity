import type { ComponentProps } from "react";
import { clsx } from "clsx";

import type { ComponentOrTag, DynamicProps, ElementSize } from "@shared/types";
import { mod } from "@/shared/utils";

import s from "./container.module.scss";

export type ContainerProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = DynamicProps<Element> & {
  className?: string;
  children?: React.ReactNode;
  size?: ElementSize;
};

export const Container = <
  Element extends ComponentOrTag<ComponentProps<Element>>,
>(
  props: ContainerProps<Element>,
) => {
  const {
    children,
    className,
    size = "l",
    tag: Component = "div",
    ...restProps
  } = props as ContainerProps<"div">;

  const mods = mod(s, {
    size,
  });

  return (
    <Component className={clsx(s.root, className, mods)} {...restProps}>
      {children}
    </Component>
  );
};

Container.displayName = "Container";

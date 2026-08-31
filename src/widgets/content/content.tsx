import type { ComponentProps } from "react";
import clsx from "clsx";

import { Heading } from "@shared/ui/typography/heading";

import s from "./content.module.scss";

export type ContentProps = ComponentProps<"div"> & {
  className?: string;
  title: string;
  children?: React.ReactNode;
};

export const Content = (props: ContentProps) => {
  const { className, title, children, ...rest } = props;

  return (
    <div className={clsx(s.root, className)} {...rest}>
      <div className={s.header}>
        <Heading level="3" className={s.title}>
          {title}
        </Heading>
      </div>
      {children}
    </div>
  );
};

Content.displayName = "Content";

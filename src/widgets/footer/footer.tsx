import clsx from "clsx";
import type { ComponentProps } from "react";

import s from "./footer.module.scss";

export type FooterProps = ComponentProps<"div"> & {
  className?: string;
};

export const Footer = (props: FooterProps) => {
  const { className } = props;

  return <div className={clsx(s.root, className)}>footer</div>;
};

Footer.displayName = "Footer";

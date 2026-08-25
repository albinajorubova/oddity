import type { ComponentProps } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { Icon } from "@shared/ui/icon";

import s from "./burger.module.scss";

export type BurgerProps = ComponentProps<"div"> & {
  className?: string;
  text: string;
  closeText: string;
  isOpen?: boolean;
  onClick?: () => void;
};

export const Burger = (props: BurgerProps) => {
  const { className, text, closeText, isOpen, onClick } = props;

  const currentText = isOpen ? `${closeText} <span>${text}</span>` : text;
  const currentIcon = !isOpen ? "menu" : "close-burg";

  return (
    <Button
      className={clsx(s.root, "typo-caption", className, {
        [s.open]: isOpen,
      })}
      onClick={onClick}
    >
      <span
        className={s.text}
        dangerouslySetInnerHTML={{ __html: currentText }}
      />
      <Icon size="l" name={currentIcon} />
    </Button>
  );
};

Burger.displayName = "Burger";

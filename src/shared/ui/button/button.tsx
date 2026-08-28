"use client";

import type React from "react";
import clsx from "clsx";
import Link from "next/link";

import s from "./button.module.scss";

// Общие пропсы
type BaseProps = {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

// Ветка кнопки
type ButtonAsButton = BaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  > & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

// Ветка ссылки (через next/link)
type ButtonAsLink = BaseProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = (props: ButtonProps) => {
  // Рендер через Link, если есть href
  if ("href" in props && props.href) {
    const { className, children, href, disabled, onClick, ...rest } = props;

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    return (
      <Link
        href={href}
        className={clsx(s.root, className)}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : rest.tabIndex}
        onClick={handleClick}
        scroll={false}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // Обычная кнопка
  const {
    className,
    children,
    disabled,
    type = "button",
    onClick,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(s.root, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";

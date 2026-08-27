"use client";

import type React from "react";
import { useState } from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button } from "@shared/ui/button";
import { Icon, type IconName } from "@shared/ui/icon";
import { mod } from "@shared/utils/css-mods";

import s from "./input.module.scss";

export type InputSize = ElementSize;
export type InputScheme = "primary" | "secondary" | "line";

export type InputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "size"
> & {
  className?: string;
  sizeScheme?: InputSize;
  scheme?: InputScheme;
  icon?: IconName;
  error?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  initialValue?: string;
  /** Show clear button. Default: false for `line`, true otherwise. */
  clearable?: boolean;
  /** Animate placeholder out on focus / when filled. Default: true for `line`. */
  animatedPlaceholder?: boolean;
};

export const Input = (props: InputProps) => {
  const {
    className,
    sizeScheme = "s",
    scheme = "primary",
    icon,
    error,
    ref,
    initialValue = "",
    disabled,
    clearable,
    animatedPlaceholder,
    placeholder,
    value: valueProp,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    ...inputProps
  } = props;

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(valueProp ?? defaultValue ?? initialValue ?? ""),
  );
  const [isFocused, setIsFocused] = useState(false);

  const value = isControlled ? String(valueProp ?? "") : uncontrolledValue;
  const isFilled = value.length > 0;
  const showClear = clearable ?? scheme !== "line";
  const useAnimatedPlaceholder = animatedPlaceholder ?? scheme === "line";
  const isPlaceholderHidden = useAnimatedPlaceholder && (isFocused || isFilled);

  const mods = mod(s, {
    size: sizeScheme,
    scheme,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) setUncontrolledValue("");
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <div
      className={clsx(
        s.root,
        mods,
        isFilled && s.filled,
        isFocused && s.focused,
        disabled && s.disabled,
        icon && s.withIcon,
        error && s.hasError,
        useAnimatedPlaceholder && s.animatedPlaceholder,
        className,
      )}
    >
      <div className={s.controlWrap}>
        {icon && (
          <span className={clsx(s.iconWrap, s.left)}>
            <Icon className={s.icon} name={icon} size={sizeScheme} />
          </span>
        )}

        {useAnimatedPlaceholder && placeholder && (
          <span
            className={clsx(
              s.placeholder,
              "typo-caption",
              isPlaceholderHidden && s.isPlaceholderHidden,
            )}
            aria-hidden
          >
            {placeholder}
          </span>
        )}

        <input
          {...inputProps}
          value={value}
          ref={ref}
          className={clsx(s.control, "typo-caption")}
          placeholder={useAnimatedPlaceholder ? undefined : placeholder}
          aria-label={
            inputProps["aria-label"] ??
            (useAnimatedPlaceholder ? placeholder : undefined)
          }
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
        />

        {scheme === "line" && (
          <>
            <span className={s.line} aria-hidden />
            <span className={s.lineAccent} aria-hidden />
          </>
        )}

        {showClear && (
          <Button className={s.clear} onClick={handleClear} type="button">
            <Icon size="s" name="close" />
          </Button>
        )}
      </div>
      {error && (
        <div className={clsx(s.error, "typo-p2")}>
          <Icon size="xs" name="warn" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

Input.displayName = "Input";

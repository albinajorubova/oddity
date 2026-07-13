"use client";

import type React from "react";
import { useMemo, useState } from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button } from "@shared/ui/button";
import { Icon, type IconName } from "@shared/ui/icon";
import { mod } from "@shared/utils/css-mods";

import s from "./input.module.scss";

export type InputSize = ElementSize;
export type InputScheme = "primary" | "secondary";

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  className?: string;
  sizeScheme?: InputSize;
  scheme?: InputScheme;
  icon?: IconName;
  error?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  initialValue?: string;
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
    ...inputProps
  } = props;

  const [value, setValue] = useState<string | undefined>(initialValue);

  const mods = mod(s, {
    size: sizeScheme,
    scheme,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
  };

  const isFilled = useMemo(() => {
    return !!value;
  }, [value]);

  const renderClear = !disabled;

  return (
    <div
      className={clsx(
        s.root,
        mods,
        isFilled && s.filled,
        disabled && s.disabled,
        icon && s.withIcon,
        error && s.hasError,
        className,
      )}
    >
      <div className={s.controlWrap}>
        {icon && (
          <span className={clsx(s.iconWrap, s.left)}>
            <Icon className={s.icon} name={icon} size={sizeScheme} />
          </span>
        )}
        <input
          value={value}
          ref={ref}
          className={s.control}
          onChange={handleChange}
          disabled={disabled}
          {...inputProps}
        />

        {renderClear && (
          <Button className={s.clear} onClick={handleClear}>
            <Icon size="s" name="close" />
          </Button>
        )}
      </div>
      {error && (
        <div className={s.error}>
          <Icon size="xs" name="warn" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

Input.displayName = "Input";

import { type ComponentProps, useMemo } from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { mod } from "@shared/utils/css-mods";

import { ICONS, type IconName } from "./icons";

import s from "./icon.module.scss";

export type IconProps = ComponentProps<"div"> & {
  className?: string;
  size: ElementSize;
  name: IconName;
};

export const Icon = (props: IconProps) => {
  const { className, name, size = "s" } = props;

  const Svg = useMemo(() => {
    return ICONS[name];
  }, [name]);

  if (!Svg) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Icon] Не найдена иконка с именем "${name}". Проверьте карту ICONS.`,
      );
    }
    return null;
  }

  const mods = mod(s, { size });

  return <Svg className={clsx(s.root, mods, className)} />;
};

Icon.displayName = "Icon";

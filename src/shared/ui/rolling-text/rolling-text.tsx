"use client";

import type { CSSProperties } from "react";
import clsx from "clsx";

import s from "./rolling-text.module.scss";

export type RollingTextProps = {
  text: string;
  className?: string;
};

export const RollingText = (props: RollingTextProps) => {
  const { text, className } = props;

  return (
    <span className={clsx(s.root, className)} aria-hidden>
      {Array.from(text).map((char, i) => (
        <span
          key={`${i}-${char}`}
          className={s.letter}
          style={
            {
              "--delay": `${i * 35}ms`,
              "--duration": `${450 + (i % 4) * 80}ms`,
              "--direction": i % 2 === 0 ? "-25%" : "-50%",
            } as CSSProperties
          }
        >
          <span className={s.drum}>
            <span>{char === " " ? "\u00A0" : char}</span>
            <span>{char === " " ? "\u00A0" : char}</span>
            <span>{char === " " ? "\u00A0" : char}</span>
            <span>{char === " " ? "\u00A0" : char}</span>
          </span>
        </span>
      ))}
    </span>
  );
};

RollingText.displayName = "RollingText";

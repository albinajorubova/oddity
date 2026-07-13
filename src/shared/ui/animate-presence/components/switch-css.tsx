import type { ComponentProps } from "react";

import { useCountValueUpdate } from "@shared/hooks/use-count-value-update";

import { AnimatePresence } from "../components/animate-presence";
import { PresenceChildCSS } from "../components/presence-child-css";
import type { AnimatePresenceMode } from "../types";

export type SwitchCssProps = ComponentProps<"div"> & {
  transitionKey: string | number;
  children: React.ReactElement;
  mode?: AnimatePresenceMode;
};

export const SwitchCss = ({
  transitionKey,
  children,
  mode = "wait",
}: SwitchCssProps) => {
  const countListRender = useCountValueUpdate<string | number>(transitionKey);

  return (
    <AnimatePresence mode={mode}>
      <PresenceChildCSS key={`${transitionKey}-${countListRender.current}`}>
        {children}
      </PresenceChildCSS>
    </AnimatePresence>
  );
};

SwitchCss.displayName = "SwitchCss";

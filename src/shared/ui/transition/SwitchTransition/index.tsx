import type { Mode } from "../useSwitchTransition/types";

import type { Stage } from "..";
import { useSwitchTransition } from "..";

type SwitchTransitionProps<S> = {
  state: S;
  timeout: number;
  mode: Mode;
  children: (state: S, stage: Stage) => React.ReactNode;
  onEnter?: () => void;
  onLeave?: () => void;
};

export function SwitchTransition<S>({
  state,
  timeout,
  mode,
  children,
  onEnter,
  onLeave,
}: SwitchTransitionProps<S>) {
  const transition = useSwitchTransition(
    state,
    timeout,
    mode,
    onEnter,
    onLeave,
  );

  return transition(children);
}

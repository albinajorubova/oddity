import { Fragment, useEffect, useRef, useState } from "react";

import type { Stage } from "../useTransition";
import type { ListItem, Mode } from "./types";
import { useDefaultMode } from "./useDefaultMode";
import { useInOutMode } from "./useInOutMode";
import { useOutInMode } from "./useOutInMode";

type RenderCallback<S> = (state: S, stage: Stage) => React.ReactNode;

export function useSwitchTransition<S>(
  state: S,
  timeout: number,
  mode?: Mode,
  onEnter?: () => void,
  onLeave?: () => void,
) {
  const keyRef = useRef(0);
  const firstDefaultItem: ListItem<S> = {
    state,
    key: keyRef.current,
    stage: "enter",
  };
  const [list, setList] = useState([firstDefaultItem]);
  const prevListRef = useRef(list);

  // for default mode only
  useDefaultMode({ state, timeout, keyRef, mode, list, setList });

  // for out-in mode only
  useOutInMode({ state, timeout, keyRef, mode, list, setList });

  // for in-out mode only
  useInOutMode({ state, timeout, keyRef, mode, list, setList });

  // Track stage changes and call callbacks
  useEffect(() => {
    const prevList = prevListRef.current;
    const currentList = list;

    // Check for enter stage - element transitioned to "enter" from another stage
    const hasEntered = currentList.some((item) => {
      if (item.stage !== "enter") return false;
      const prevItem = prevList.find((prev) => prev.key === item.key);
      return prevItem && prevItem.stage !== "enter";
    });

    // Check for leave stage - element transitioned to "leave" from another stage
    const hasLeft = currentList.some((item) => {
      if (item.stage !== "leave") return false;
      const prevItem = prevList.find((prev) => prev.key === item.key);
      return prevItem && prevItem.stage !== "leave";
    });

    if (hasEntered && onEnter) {
      onEnter();
    }

    if (hasLeft && onLeave) {
      onLeave();
    }

    prevListRef.current = list;
  }, [list, onEnter, onLeave]);

  function transition(renderCallback: RenderCallback<S>) {
    return list.map((item) => (
      <Fragment key={item.key}>
        {renderCallback(item.state, item.stage)}
      </Fragment>
    ));
  }

  return transition;
}

import { createContext } from "react";

type TransitionLayoutContextType = {
  isVisible: boolean;
  transitionStarted: boolean;
};

export const TransitionLayoutContext =
  createContext<TransitionLayoutContextType>({
    isVisible: false,
    transitionStarted: false,
  });

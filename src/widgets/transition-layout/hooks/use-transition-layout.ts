import { useContext } from "react";

import { TransitionLayoutContext } from "../context/transition-layout-context";

export const useTransitionLayout = () => {
  const context = useContext(TransitionLayoutContext);

  if (!context) {
    throw new Error(
      "useTransitionLayout must be used within a TransitionLayoutContext",
    );
  }

  return context;
};

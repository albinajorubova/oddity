import { memo } from "react";
import type { NextRouter } from "next/router";

import { TransitionLayoutContext } from "./context/transition-layout-context";

export type TransitionLayoutProps = {
  children: React.ReactNode;
  router: NextRouter;
};

export const TransitionLayout = memo(({ children }: TransitionLayoutProps) => {
  return (
    <main>
      <TransitionLayoutContext.Provider
        value={{
          isVisible: true,
          transitionStarted: false,
        }}
      >
        {children}
      </TransitionLayoutContext.Provider>
    </main>
  );
});

TransitionLayout.displayName = "TransitionLayout";

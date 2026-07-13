import React from "react";

import type { ScrollContextType } from "./types";

export const ScrollContext = React.createContext<ScrollContextType>({
  scroll: null,
  removeCallback: () => {},
  addCallback: () => {},
});

export const useCurrentScroll = (): ScrollContextType => {
  const context = React.useContext(ScrollContext);

  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }

  return context;
};

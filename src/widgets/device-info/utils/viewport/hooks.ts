import { useContext } from "react";

import { ViewportContext } from "./context";
import type { Viewports } from "./utils";

export const useViewport = (): Viewports => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used below a <ViewportProvider>");
  }
  return context;
};

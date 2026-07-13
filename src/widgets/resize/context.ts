import { createContext, useContext } from "react";

export type ResizeContextType = {
  addCallback: (callback: () => void, priority: number) => void;
  removeCallback: (callback: () => void) => void;
};

export const ResizeContext = createContext<ResizeContextType>({
  addCallback: () => {},
  removeCallback: () => {},
});

export const useCurrentResize = () => {
  const context = useContext(ResizeContext);

  if (context === undefined) {
    throw new Error("useResize must be used within a ScrollProvider");
  }

  return context;
};

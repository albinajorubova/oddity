import { createContext } from "react";

export interface PresenceContextValue {
  isPresent: boolean;
  safeToRemove?: () => void;
}

export const PresenceContext = createContext<PresenceContextValue | null>(null);

"use client";

import { useContext } from "react";

import { PresenceContext } from "../context";

/**
 * Hook for child components inside AnimatePresence.
 * Call `safeToRemove()` when your exit animation/logic is complete.
 */
export function usePresence(): {
  isPresent: boolean;
  safeToRemove: () => void;
} {
  const context = useContext(PresenceContext);
  return {
    isPresent: context?.isPresent ?? true,
    safeToRemove: context?.safeToRemove ?? (() => {}),
  };
}

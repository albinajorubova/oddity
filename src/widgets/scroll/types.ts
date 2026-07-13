import type { ComponentType, ReactNode } from "react";
import type Lenis from "lenis";

// Types
export interface ScrollEvent {
  targetScroll: number;
  scroll: number;
}

export interface ScrollCallback {
  callback: (event: ScrollEvent) => void;
  priority: number;
}

export interface ScrollContextType {
  scroll: Lenis | null;
  removeCallback: (callback: (event: ScrollEvent) => void) => void;
  addCallback: (
    callback: (event: ScrollEvent) => void,
    priority: number,
  ) => void;
}

export interface ScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  eventsTarget?: HTMLElement;
  wrapper?: HTMLElement;
  content?: HTMLElement;
}

export interface ScrollProps {
  as?: ComponentType<Record<string, unknown>> | string;
  children: ReactNode;
  wrapper?: boolean;
  root?: boolean;
  className?: string;
  contentClassName?: string;
  options?: Partial<ScrollOptions>;
}

// Extend window object for global scroll
declare global {
  interface Window {
    __GLOBAL_SCROLL__: Lenis;
    next: {
      router: {
        asPath: string;
      };
    };
  }
}

export type AnchorScroll = "top" | "center" | "bottom";

export type AnimatePresenceMode = "sync" | "wait";

export interface AnimatePresenceProps {
  children?: React.ReactNode;
  /** sync: show exiting + entering. wait: only exiting until done */
  mode?: AnimatePresenceMode;
  /** Called when all exit animations complete */
  onExitComplete?: () => void;
  /** Skip initial enter animation */
  initial?: boolean;
}

export interface PresenceChildProps {
  children: React.ReactElement;
  classNames?: string;
  timeout?: number | { enter?: number; exit?: number };
}

export type PresenceChildCSSProps = PresenceChildProps;

export interface PresenceChildJSProps {
  children: React.ReactElement;
  onEnter?: (ref: HTMLElement | null) => void;
  onLeave?: (ref: HTMLElement | null) => void;
  onLeaveComplete?: (ref: HTMLElement | null) => void;
}

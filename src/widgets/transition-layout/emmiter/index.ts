import EventEmitter from "@shared/utils/emmiter";

export enum EVENTS_TRANSITION_LAYOUT {
  pageInStart = "pageInStart",
  pageInComplete = "pageInComplete",
  pageInCompleteStart = "pageInCompleteStart",

  pageOutStart = "pageOutStart",
  pageOutCompleteStart = "pageOutCompleteStart",
  pageOutComplete = "pageOutComplete",
  pageOutUnmount = "pageOutUnmount",
  resetScroll = "resetScroll",
}

type TransitionLayoutEvents = {
  [EVENTS_TRANSITION_LAYOUT.pageInStart]: [];
  [EVENTS_TRANSITION_LAYOUT.pageInComplete]: [];
  [EVENTS_TRANSITION_LAYOUT.pageInCompleteStart]: [];
  [EVENTS_TRANSITION_LAYOUT.pageOutStart]: [];
  [EVENTS_TRANSITION_LAYOUT.pageOutComplete]: [];
  [EVENTS_TRANSITION_LAYOUT.pageOutCompleteStart]: [];
  [EVENTS_TRANSITION_LAYOUT.pageOutUnmount]: [];
  [EVENTS_TRANSITION_LAYOUT.resetScroll]: [];
};

export const transitionLayoutEmitter =
  new EventEmitter<TransitionLayoutEvents>();

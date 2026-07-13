// Types
interface AnimationProperties {
  [key: string]: string | number;
}

interface AnimationPhase {
  [key: string]: string | number | undefined;
  ease?: string;
}

interface AnimationData {
  set: AnimationProperties;
  in: AnimationPhase;
  out: AnimationPhase;
}

interface AnimatesMap {
  [key: string]: AnimationData;
}

// Helper functions
const properties = {
  y: (v: string | number): AnimationProperties => {
    return {
      transform: `translateY(${v})`,
    };
  },
};

export const ANIMATES: AnimatesMap = {
  fade: {
    set: {
      opacity: 0,
    },
    in: {
      opacity: 1,
      ease: "sine.inOut",
    },
    out: {
      opacity: 0,
      ease: "sine.inOut",
    },
  },
  fadeTop: {
    set: {
      ...properties.y("1.8vw"),
      opacity: 0,
    },
    in: {
      y: 0,
      opacity: 1,
      ease: "sine.inOut",
    },
    out: {
      y: "1.8vw",
      opacity: 0,
      ease: "sine.inOut",
    },
  },
};

export type { AnimationData, AnimatesMap };

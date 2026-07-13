import type { Stage } from "@/shared/ui/transition/useTransition";

export const getIsVisibleProps = (stage: Stage) => {
  return stage === "enter" || stage === "from";
};

import { useEffect } from "react";
import { useUiStore } from "@app/model/ui-store";

export const useStopScrollOnOpenMenu = (root: boolean) => {
  const isOpenMenu = useUiStore((store) => store.isOpenMenu);

  useEffect(() => {
    if (!root) return;
    if (isOpenMenu) {
      window.__GLOBAL_SCROLL__.stop();

      return () => {
        window.__GLOBAL_SCROLL__.start();
      };
    }
  }, [isOpenMenu]);
};

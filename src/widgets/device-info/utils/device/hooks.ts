import { useIsHydrated } from "@shared/hooks/use-is-hydrated";
import { useContext } from "react";

import { DeviceContext } from "./context";
import { type DeviceInfo, getDeviceObject } from "./lib/detect";

export const useDeviceDetectOnce = (): Partial<DeviceInfo> => {
  const isHydrated = useIsHydrated();
  if (!isHydrated) return {};
  return getDeviceObject();
};

export const useDeviceDetect = (): DeviceInfo => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDeviceDetect must be used below a <DeviceProvider>");
  }
  return context;
};

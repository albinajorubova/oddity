"use client";

import { isApiSupported } from "@shared/utils";
import isEqual from "lodash.isequal";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  DeviceContext,
  type DeviceInfo,
  getDeviceObject,
} from "./utils/device";
import {
  getCurrentViewport,
  getViewports,
  VIEWPORTS_INITIAL,
  ViewportContext,
  type Viewports,
} from "./utils/viewport";

interface DeviceInfoProviderProps {
  children: ReactNode;
}

export const DeviceInfoProvider = ({ children }: DeviceInfoProviderProps) => {
  const [viewport, setViewport] = useState<Viewports>(VIEWPORTS_INITIAL);
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo>(
    {} as DeviceInfo,
  );

  useEffect(() => {
    if (!isApiSupported("matchMedia")) {
      console.warn("matchMedia is not supported by your current browser");
      return;
    }

    const viewports = getViewports();
    const current = getCurrentViewport(viewports);

    setViewport({ ...viewports, current });
  }, []);

  useEffect(() => {
    if (!isApiSupported("matchMedia")) {
      console.warn("matchMedia is not supported by your current browser");
      return;
    }

    const changeHandler = () => {
      const viewports = getViewports();
      const current = getCurrentViewport(viewports);
      const viewportsData = { ...viewports, current };

      setViewport((prev) =>
        !isEqual(viewportsData, prev) ? viewportsData : prev,
      );
    };

    changeHandler();

    window.addEventListener("resize", changeHandler);

    return () => {
      window.removeEventListener("resize", changeHandler);
    };
  }, []);

  useEffect(() => {
    const setDevice = () => {
      setCurrentDevice((prev) => {
        const deviceInfo = getDeviceObject();
        return !isEqual(deviceInfo, prev) ? deviceInfo : prev;
      });
    };

    setDevice();

    window.addEventListener("resize", setDevice);

    return () => {
      window.removeEventListener("resize", setDevice);
    };
  }, []);

  const viewportValue = useMemo(() => ({ ...viewport }), [viewport]);
  const deviceValue = useMemo(() => ({ ...currentDevice }), [currentDevice]);

  return (
    <ViewportContext.Provider value={viewportValue}>
      <DeviceContext.Provider value={deviceValue}>
        {children}
      </DeviceContext.Provider>
    </ViewportContext.Provider>
  );
};

"use client";

import { createContext } from "react";

import type { DeviceInfo } from "./lib/detect";

export const DeviceContext = createContext<DeviceInfo | undefined>(undefined);

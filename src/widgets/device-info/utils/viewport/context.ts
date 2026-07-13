"use client";

import { createContext } from "react";

import type { Viewports } from "./utils";

export const ViewportContext = createContext<Viewports | undefined>(undefined);

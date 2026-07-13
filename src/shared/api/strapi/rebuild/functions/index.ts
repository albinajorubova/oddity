import type { RebuildFunction } from "./types";

export const functions: RebuildFunction[] = [];

const automaticEnable: Record<string, boolean> = {};

Object.keys(functions).forEach((key) => {
  automaticEnable[key] = true;
});

export const defaultEnable: Record<string, boolean> = {
  ...automaticEnable,
};

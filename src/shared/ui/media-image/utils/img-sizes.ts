import type { BreakpointKeys } from "@shared/types";
import { BREAKPOINTS } from "@/shared/config/breakpoints";

export interface GenerateSizesOptions {
  [key: string]: number | undefined;
  default: number;
}

export function imgSizes(options: GenerateSizesOptions): string {
  const { default: defaultValue = 100, ...breakpointSizes } = options;

  const sortedBreakpoints = Object.entries(BREAKPOINTS).sort(
    ([, a], [, b]) => a - b,
  ) as Array<[BreakpointKeys, number]>;

  const sizesParts: string[] = [];

  for (const [key, breakpointValue] of sortedBreakpoints) {
    const size = breakpointSizes[key];

    if (size !== undefined && size !== null) {
      sizesParts.push(`(max-width: ${breakpointValue}px) ${size}vw`);
    }
  }

  sizesParts.push(`${defaultValue}vw`);
  return sizesParts.join(", ");
}

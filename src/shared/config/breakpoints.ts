/**
 * Breakpoints configuration matching SCSS breakpoints
 * @see src/shared/styles/vars/_breakpoints.scss
 */
export const BREAKPOINTS = {
  xs: 360,
  sm: 481,
  md: 769,
  lg: 1025,
  xl: 1280,
  "2xl": 1440,
} as const;

export const IMAGE_BREAKPOINTS = {
  xs: 320,
  sm: 720,
  md: 1440,
  lg: 1920,
  xl: 2560,
  "2xl": null,
} as const;

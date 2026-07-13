// Based on https://gist.github.com/gre/1650294
// https://andrewraycode.github.io/easing-utils/gh-pages/

/* eslint-disable */

/**
 * Easing function type - takes a normalized time value (0-1) and returns eased value
 */
export type EasingFunction = (t: number) => number;

/**
 * Easing function with optional magnitude parameter
 */
export type EasingFunctionWithMagnitude = (
  t: number,
  magnitude?: number,
) => number;

export const easeInOutCubic: EasingFunction = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

// Slight acceleration from zero to full speed
export const easeInSine: EasingFunction = (t: number): number =>
  -1 * Math.cos(t * (Math.PI / 2)) + 1;

// Slight deceleration at the end
export const easeOutSine: EasingFunction = (t: number): number =>
  Math.sin(t * (Math.PI / 2));

// Slight acceleration at beginning and slight deceleration at end
export const easeInOutSine: EasingFunction = (t: number): number =>
  -0.5 * (Math.cos(Math.PI * t) - 1);

// Accelerating from zero velocity
export const easeInQuad: EasingFunction = (t: number): number => t * t;

// Decelerating to zero velocity
export const easeOutQuad: EasingFunction = (t: number): number => t * (2 - t);

// Acceleration until halfway, then deceleration
export const easeInOutQuad: EasingFunction = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Accelerating from zero velocity
export const easeInCubic: EasingFunction = (t: number): number => t * t * t;

// Decelerating to zero velocity
export const easeOutCubic: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

// Acceleration until halfway, then deceleration

// Accelerating from zero velocity
export const easeInQuart: EasingFunction = (t: number): number => t * t * t * t;

// Decelerating to zero velocity
export const easeOutQuart: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

// Acceleration until halfway, then deceleration
export const easeInOutQuart: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
};

// Accelerating from zero velocity
export const easeInQuint: EasingFunction = (t: number): number =>
  t * t * t * t * t;

// Decelerating to zero velocity
export const easeOutQuint: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
};

// Acceleration until halfway, then deceleration
export const easeInOutQuint: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
};

// Accelerate exponentially until finish
export const easeInExpo: EasingFunction = (t: number): number => {
  if (t === 0) {
    return 0;
  }

  return 2 ** (10 * (t - 1));
};

// Initial exponential acceleration slowing to stop
export const easeOutExpo: EasingFunction = (t: number): number => {
  if (t === 1) {
    return 1;
  }

  return -(2 ** (-10 * t)) + 1;
};

// Exponential acceleration and deceleration
export const easeInOutExpo: EasingFunction = (t: number): number => {
  if (t === 0 || t === 1) {
    return t;
  }

  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;

  if (scaledTime < 1) {
    return 0.5 * 2 ** (10 * scaledTime1);
  }

  return 0.5 * (-(2 ** (-10 * scaledTime1)) + 2);
};

// Increasing velocity until stop
export const easeInCirc: EasingFunction = (t: number): number => {
  const scaledTime = t / 1;
  return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
};

// Start fast, decreasing velocity until stop
export const easeOutCirc: EasingFunction = (t: number): number => {
  const t1 = t - 1;
  return Math.sqrt(1 - t1 * t1);
};

// Fast increase in velocity, fast decrease in velocity
export const easeInOutCirc: EasingFunction = (t: number): number => {
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 2;

  if (scaledTime < 1) {
    return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
  }

  return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
};

// Slow movement backwards then fast snap to finish
export const easeInBack: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 1.70158,
): number => t * t * ((magnitude + 1) * t - magnitude);

// Fast snap to backwards point then slow resolve to finish
export const easeOutBack: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 1.70158,
): number => {
  const scaledTime = t / 1 - 1;

  return (
    scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1
  );
};

// Slow movement backwards, fast snap to past finish, slow resolve to finish
export const easeInOutBack: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 1.70158,
): number => {
  const scaledTime = t * 2;
  const scaledTime2 = scaledTime - 2;

  const s = magnitude * 1.525;

  if (scaledTime < 1) {
    return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
  }

  return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
};

// Bounces slowly then quickly to finish
export const easeInElastic: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 0.7,
): number => {
  if (t === 0 || t === 1) {
    return t;
  }

  const scaledTime = t / 1;
  const scaledTime1 = scaledTime - 1;

  const p = 1 - magnitude;
  const s = (p / (2 * Math.PI)) * Math.asin(1);

  return -(
    2 ** (10 * scaledTime1) *
    Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p)
  );
};

// Fast acceleration, bounces to zero
export const easeOutElastic: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 0.7,
): number => {
  if (t === 0 || t === 1) {
    return t;
  }

  const p = 1 - magnitude;
  const scaledTime = t * 2;

  const s = (p / (2 * Math.PI)) * Math.asin(1);
  return (
    2 ** (-10 * scaledTime) * Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) +
    1
  );
};

// Slow start and end, two bounces sandwich a fast motion
export const easeInOutElastic: EasingFunctionWithMagnitude = (
  t: number,
  magnitude: number = 0.65,
): number => {
  if (t === 0 || t === 1) {
    return t;
  }

  const p = 1 - magnitude;
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;

  const s = (p / (2 * Math.PI)) * Math.asin(1);

  if (scaledTime < 1) {
    return (
      -0.5 *
      (2 ** (10 * scaledTime1) *
        Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p))
    );
  }

  return (
    2 ** (-10 * scaledTime1) *
      Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) *
      0.5 +
    1
  );
};

// Bounce to completion
export const easeOutBounce: EasingFunction = (t: number): number => {
  const scaledTime = t / 1;

  if (scaledTime < 1 / 2.75) {
    return 7.5625 * scaledTime * scaledTime;
  } else if (scaledTime < 2 / 2.75) {
    const scaledTime2 = scaledTime - 1.5 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
  } else if (scaledTime < 2.5 / 2.75) {
    const scaledTime2 = scaledTime - 2.25 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
  } else {
    const scaledTime2 = scaledTime - 2.625 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
  }
};

// Bounce increasing in velocity until completion
export const easeInBounce: EasingFunction = (t: number): number =>
  1 - easeOutBounce(1 - t);

// Bounce in and bounce out
export const easeInOutBounce: EasingFunction = (t: number): number =>
  t < 0.5 ? easeInBounce(t * 2) * 0.5 : easeOutBounce(t * 2 - 1) * 0.5 + 0.5;

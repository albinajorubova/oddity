export const delayPromise = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

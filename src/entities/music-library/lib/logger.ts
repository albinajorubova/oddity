const DEBUG = process.env.NODE_ENV === "development";

export const musicLog = (...args: unknown[]): void => {
  if (DEBUG) console.log("[music-library]", ...args);
};

export const musicError = (...args: unknown[]): void => {
  console.error("[music-library]", ...args);
};

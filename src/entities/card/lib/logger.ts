const PREFIX = "[cards]";

export const cardLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(PREFIX, ...args);
  }
};

export const cardError = (...args: unknown[]): void => {
  console.error(PREFIX, ...args);
};

export const cardWarn = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.warn(PREFIX, ...args);
  }
};

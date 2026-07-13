export const debounce = <Params extends unknown[]>(
  callback: (...args: Params) => void,
  timeout: number,
): ((...args: Params) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Params) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), timeout);
  };
};

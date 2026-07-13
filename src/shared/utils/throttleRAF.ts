type ThrottledFunction<T extends (...args: never[]) => unknown> = T & {
  cancel: () => void;
};

export function throttleRAF<T extends (...args: never[]) => unknown>(
  func: T,
  maxFPS: number = 60,
): ThrottledFunction<T> {
  // Проверка на корректность maxFPS
  if (typeof maxFPS !== "number" || maxFPS <= 0) {
    maxFPS = 60;
    console.warn(
      "maxFPS должен быть положительным числом. Установлено значение 60.",
    );
  }

  let isPending: boolean = false;
  let lastArgs: Parameters<T> | null = null;
  let context: ThisParameterType<T> | null = null;
  let lastExecTime: number = 0;
  const minInterval: number = 1000 / maxFPS; // Интервал в миллисекундах

  const throttled = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    lastArgs = args;
    context = this;

    if (!isPending) {
      isPending = true;
      requestAnimationFrame(() => {
        const now: number = performance.now();

        // Проверяем, прошел ли минимальный интервал
        if (now - lastExecTime >= minInterval && lastArgs !== null) {
          func.apply(context, lastArgs);
          lastExecTime = now;
        }

        isPending = false;
      });
    }
  } as ThrottledFunction<T>;

  // Метод для ручной отмены
  throttled.cancel = (): void => {
    isPending = false;
  };

  return throttled;
}

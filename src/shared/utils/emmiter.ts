/* TypeScript */
type Handler<Args extends unknown[]> = (...args: Args) => void;

export default class EventEmitter<Events extends Record<string, unknown[]>> {
  private callbacks: {
    [K in keyof Events]?: Handler<Events[K]>[];
  } = {};

  // есть ли подписчики на событие
  exists = <K extends keyof Events>(event: K): boolean =>
    Boolean(this.callbacks[event]?.length);

  // подписка
  on = <K extends keyof Events>(
    event: K,
    callback: Handler<Events[K]>,
  ): void => {
    // инициализируем массив подписчиков для события, если его не было
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  };

  // отписка
  off = <K extends keyof Events>(
    event: K,
    callback: Handler<Events[K]>,
  ): void => {
    this.callbacks[event] = this.callbacks[event]?.filter(
      (cb) => cb !== callback,
    );
  };

  // отправка события (emit)
  send = <K extends keyof Events>(event: K, ...data: Events[K]): void => {
    const list = this.callbacks[event];
    if (!list || list.length === 0) return;
    // вызываем подписчиков без возврата значений
    for (const cb of list) cb(...data);
  };
}

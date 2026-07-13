/**
 * Проверяет, является ли значение объектом (не null, не массив)
 */
export const isObject = (
  val: unknown,
): val is Record<string, unknown> => {
  return typeof val === "object" && val !== null && !Array.isArray(val);
};

/**
 * Проверяет, является ли значение объектом (включая проверку конструктора)
 * Более строгая проверка для случаев, когда нужно исключить объекты-обертки
 */
export const isPlainObject = (
  a: unknown,
): a is Record<string, unknown> => {
  return !!a && a.constructor.name === "Object";
};

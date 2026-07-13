export const is = {
  arr: Array.isArray,
  obj: (a: unknown) => !!a && a.constructor.name === "Object",
  fun: (a: unknown) => typeof a === "function",
  str: (a: unknown) => typeof a === "string",
  num: (a: unknown) => typeof a === "number",
  und: (a: unknown) => a === undefined,
};

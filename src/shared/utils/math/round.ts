export const round = (num: number, precision: number = 2) =>
  Math.round(num * 10 ** precision) / 10 ** precision;

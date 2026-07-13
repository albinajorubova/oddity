export function map(
  value: number,
  min: number,
  max: number,
  nmin: number,
  nmax: number,
): number {
  return ((value - min) / (max - min)) * (nmax - nmin) + nmin;
}

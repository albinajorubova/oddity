export function smoothstepModified(
  min: number,
  max: number,
  value: number,
): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x;
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3.0 - 2.0 * x);
}

export const step = (edge: number, x: number): number => (x < edge ? 0 : 1);

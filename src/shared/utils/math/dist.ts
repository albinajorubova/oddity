export const sqaDist = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const getHypotenuse = (x: number, y: number) => {
  return Math.sqrt(x ** 2 + y ** 2);
};

export const distanceToCircle = (
  point: { x: number; y: number },
  circle: { cx: number; cy: number; r: number },
) => {
  const dx = point.x - circle.cx;
  const dy = point.y - circle.cy;
  const distToCenter = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, distToCenter - circle.r);
};

export const distanceToRect = (
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number },
) => {
  const dx = Math.max(0, Math.min(point.x - rect.x, rect.width));
  const dy = Math.max(0, Math.min(point.y - rect.y, rect.height));
  return Math.sqrt(dx * dx + dy * dy);
};

export const distanceToElepsoid = (
  point: { x: number; y: number },
  elepsoid: { cx: number; cy: number; rx: number; ry: number },
) => {
  const dx = point.x - elepsoid.cx;
  const dy = point.y - elepsoid.cy;
  return Math.sqrt(
    ((dx * dx) / elepsoid.rx) * elepsoid.rx +
      ((dy * dy) / elepsoid.ry) * elepsoid.ry,
  );
};

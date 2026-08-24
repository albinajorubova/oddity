export type BgMorphDirection = "top" | "right" | "bottom";

export type MorphPoints = {
  start: number;
  center: number;
  offset: number;
};

export type MorphSizes = {
  width: number;
  height: number;
};

type MorphFn = (sizes: MorphSizes, points: MorphPoints) => string;

// prettier-ignore
export const morphConcat = (type: BgMorphDirection): MorphFn => {
  switch (type) {
    case "right":
      return ({ width, height }, points) => {
        return `
          M${width} 0 
          L${width} ${height} 
          L${width - width * points.start} ${height} 
          Q${width - points.center * (1 + points.offset) * width} ${0.5 * height} 
          ${width - width * points.start} 0 Z`;
      };
    case "bottom":
      return ({ width, height }, points) => {
        return `
          M0 ${height}
          L${width} ${height}
          L${width} ${height - height * points.start}
          Q${0.5 * width} ${
          height - points.center * (1 + points.offset) * height
        }
          0 ${height - height * points.start}
          Z
        `;
      };
    default:
      return ({ width, height }, points) => {
        return `
          M0 0 
          L${width} 0
          L${width} ${height * points.start} 
          Q${0.5 * width} ${points.center * (1 + points.offset) * height} 
          0 ${height * points.start} 
          Z
        `;
      };
  }
};

export type CalculateSizeImageOrig = {
  width: number;
  height: number;
};

export type CalculateSizeImageArgs = {
  orig: CalculateSizeImageOrig;
};

export type CalculateSizeImageResult = {
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
  uvRate: {
    x: number;
    y: number;
  };
};

// ... existing code ...
export const calculateSizeImage = (
  wWidth: number,
  wHeight: number,
  { orig }: CalculateSizeImageArgs,
  cover: boolean,
): CalculateSizeImageResult => {
  const { height: targetH, width: targetW } = orig;

  const rw = wWidth / targetW;
  const rh = wHeight / targetH;
  let r: number;

  if (cover) {
    r = rw > rh ? rw : rh;
  } else {
    r = rw < rh ? rw : rh;
  }

  return {
    left: (wWidth - targetW * r) >> 1, // eslint-disable-line
    top: (wHeight - targetH * r) >> 1, // eslint-disable-line
    width: targetW * r,
    height: targetH * r,
    scale: r,
    uvRate: {
      x: (targetW * r) / wWidth,
      y: (targetH * r) / wHeight,
    },
  };
};

import { useEffect } from "react";
import normalizeWheel from "normalize-wheel-es";

export type WheelEventData = {
  x: number;
  y: number;
  delta: {
    x: number;
    y: number;
  };
  type: "wheel";
};

type WheelCallback = (event: WheelEventData) => void;

const useWheel = (
  cb: WheelCallback = () => {},
  enable: boolean = false,
  mouseScrollMultiplier: number = 1,
): void => {
  const onWheel = (event: WheelEvent) => {
    const { pixelY, pixelX } = normalizeWheel(event);

    cb({
      x: pixelX,
      y: pixelY,
      delta: {
        x: pixelX * mouseScrollMultiplier,
        y: -pixelY * mouseScrollMultiplier,
      },
      type: "wheel",
    });
  };

  useEffect(() => {
    if (enable) {
      window.addEventListener("wheel", onWheel);

      return () => {
        window.removeEventListener("wheel", onWheel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable]);
};

export default useWheel;

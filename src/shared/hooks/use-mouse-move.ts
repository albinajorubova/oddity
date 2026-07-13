import { useEffect } from "react";

export const useMouseMove = (cb: (e: MouseEvent) => void) => {
  const handle = (e: MouseEvent) => {
    if (cb) cb(e);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handle);

    return () => {
      document.addEventListener("mousemove", handle);
    };
  }, []);
};

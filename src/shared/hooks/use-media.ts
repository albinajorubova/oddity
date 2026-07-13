import { useEffect, useState } from "react";

import { isApiSupported } from "@/shared/utils/is-api-supported";

export const useMedia = (mediaQuery: string, initialValue: boolean) => {
  const [isVerified, setIsVerified] = useState<boolean>(initialValue);
  useEffect(() => {
    if (!isApiSupported("matchMedia")) {
      console.warn("matchMedia is not supported by your current browser");
      return;
    }
    const mediaQueryList = window.matchMedia(mediaQuery);
    const changeHandler = () => setIsVerified(!!mediaQueryList.matches);
    changeHandler();
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", changeHandler);
      return () => {
        mediaQueryList.removeEventListener("change", changeHandler);
      };
    }
  }, [mediaQuery]);
  return isVerified;
};

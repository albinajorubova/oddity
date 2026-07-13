import { useEffect } from "react";

export const useFontsLoaded = (): void => {
  useEffect(() => {
    const maxWaitTime = 1500; // tweak this as needed.

    const timeout = window.setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      onReady();
    }, maxWaitTime);

    function onReady(): void {
      window.clearTimeout(timeout);
      document.documentElement.classList.add("fonts-loaded");
    }

    try {
      document.fonts.ready
        .then(() => {
          onReady();
        })
        .catch((error: unknown) => {
          console.error(error);
          onReady();
        });
    } catch (error: unknown) {
      console.error(error);
      onReady();
    }
  }, []); // eslint-disable-line
};

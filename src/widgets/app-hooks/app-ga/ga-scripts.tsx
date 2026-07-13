import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

import { gaTrackingId } from "@shared/config";

import { pageview } from "./utils";

export const GAScripts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingId}', {
              page_path: window.location.pathname,
            });
            // you can add more gtags here like:
            // gtag('config', '<another-tracking-code>', {
            //   page_path: window.location.pathname,
            // });
          `,
        }}
      />
    </>
  );
};

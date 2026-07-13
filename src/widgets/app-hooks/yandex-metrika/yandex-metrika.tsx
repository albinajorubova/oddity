"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

import { yandexTrackingId } from "@/shared/config/vars";

import type { YandexMetrikaProps } from "./type";

export const YandexMetrika = ({
  options = {
    webvisor: true,
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
  },
}: YandexMetrikaProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.ym) {
        window.ym(yandexTrackingId, "hit", url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${yandexTrackingId}, "init", ${JSON.stringify(options)});
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${yandexTrackingId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
};

YandexMetrika.displayName = "YandexMetrika";

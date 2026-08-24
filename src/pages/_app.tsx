import "@/shared/styles/globals.scss";

import { DataStoreProvider } from "@app/model/data-store";
import { useAppViewport } from "@app/model/viewport-store";
import { AppHooks } from "@widgets/app-hooks/app-hooks";
import { Gsap } from "@widgets/gsap";
import { Header } from "@widgets/header";
import { Preloader } from "@widgets/preloader";
import { ResizeProvider } from "@widgets/resize";
import { Scroll } from "@widgets/scroll";
import { SeoLayout } from "@widgets/seo-layout";
import { TransitionLayout } from "@widgets/transition-layout";
import { Cursor } from "@widgets/сursor";
import type { AppProps } from "next/app";

import { PreviewBanner } from "@shared/ui/preview-banner";

export default function App({ Component, pageProps, router }: AppProps) {
  useAppViewport();

  return (
    <>
      <Gsap />
      <SeoLayout
        commonSeoData={pageProps?.cms?.commonData?.seo}
        pageSeoData={pageProps?.cms?.pageSeoData}
      >
        <PreviewBanner isDraftMode={pageProps.isDraftMode} />
        <ResizeProvider>
          <DataStoreProvider data={pageProps.cms}>
            <Header />
            {/* <Cursor /> */}
            <Preloader />
            <Scroll root wrapper>
              <TransitionLayout router={router}>
                <DataStoreProvider data={pageProps.cms}>
                  <Component {...pageProps} />
                </DataStoreProvider>
              </TransitionLayout>
            </Scroll>
          </DataStoreProvider>
        </ResizeProvider>
        <AppHooks />
      </SeoLayout>
    </>
  );
}

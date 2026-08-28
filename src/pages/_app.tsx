import "@/shared/styles/globals.scss";

import { DataStoreProvider } from "@app/model/data-store";
import { UserProvider } from "@app/model/user-provider";
import { useAppViewport } from "@app/model/viewport-store";
import type { User } from "@entities/user";
import type { Seo } from "@shared/types/strapi-components";
import { AppHooks } from "@widgets/app-hooks/app-hooks";
import { Gsap } from "@widgets/gsap";
import { Header } from "@widgets/header";
import { Preloader } from "@widgets/preloader";
import { ResizeProvider } from "@widgets/resize";
import { Scroll } from "@widgets/scroll";
import { SeoLayout } from "@widgets/seo-layout";
import { TransitionLayout } from "@widgets/transition-layout";
import type { AppProps } from "next/app";

import { PreviewBanner } from "@shared/ui/preview-banner";

type OddityPageProps = {
  user?: User | null;
  userIsAuthenticated?: boolean;
  cms?: {
    commonData?: { seo?: Seo };
    pageSeoData?: Seo;
  };
  isDraftMode?: boolean;
};

export default function App({
  Component,
  pageProps,
  router,
}: AppProps<OddityPageProps>) {
  useAppViewport();

  const {
    user = null,
    userIsAuthenticated = false,
    isDraftMode = false,
  } = pageProps;

  return (
    <>
      <Gsap />
      <SeoLayout
        commonSeoData={pageProps?.cms?.commonData?.seo}
        pageSeoData={pageProps?.cms?.pageSeoData}
      >
        <PreviewBanner isDraftMode={isDraftMode} />
        <UserProvider user={user} userIsAuthenticated={userIsAuthenticated}>
          <ResizeProvider>
            <DataStoreProvider data={pageProps.cms ?? {}}>
              <Header />
              <Preloader />
              <Scroll root wrapper>
                <TransitionLayout router={router}>
                  <DataStoreProvider data={pageProps.cms ?? {}}>
                    <Component {...pageProps} />
                  </DataStoreProvider>
                </TransitionLayout>
              </Scroll>
            </DataStoreProvider>
          </ResizeProvider>
        </UserProvider>
        <AppHooks />
      </SeoLayout>
    </>
  );
}

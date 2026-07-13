import type { ReactNode } from "react";
import Head from "next/head";

import { Favicons } from "./favicons";
import { LdJson } from "./ld-json";
import { OgTags } from "./og-tags/og-tags";
import type { SeoLayoutDataType } from "./type";

export type SeoLayoutProps = SeoLayoutDataType & {
  children?: ReactNode;
};

export const SeoLayout = ({
  commonSeoData,
  pageSeoData,
  children,
}: SeoLayoutProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <OgTags commonSeoData={commonSeoData} pageSeoData={pageSeoData} />
      <Favicons />
      <LdJson commonSeoData={commonSeoData} pageSeoData={pageSeoData} />

      {children}
    </>
  );
};

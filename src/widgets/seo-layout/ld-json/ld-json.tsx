import Head from "next/head";

import type { SeoLayoutDataType } from "../type";

const serializeStructuredData = (data: string | undefined) => {
  if (!data) {
    return null;
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed.length ? trimmed : null;
  }

  try {
    return JSON.stringify(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "Unable to serialize structured data for SEO component:",
      error,
    );
    return null;
  }
};

export const LdJson = ({ pageSeoData, commonSeoData }: SeoLayoutDataType) => {
  const data = pageSeoData?.structuredData || commonSeoData?.structuredData;
  const structuredData = serializeStructuredData(data);

  if (!structuredData) return null;

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
    </Head>
  );
};

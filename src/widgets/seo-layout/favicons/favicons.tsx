import Head from "next/head";

export const Favicons = () => {
  return (
    <Head>
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/16-16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/32-32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href="/favicon/48-48.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="120x120"
        href="/favicon/120-120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/180-180.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon/192-192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="256x256"
        href="/favicon/256-256.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/favicon/512-512.png"
      />

      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

Favicons.displayName = "Favicons";

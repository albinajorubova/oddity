import type { NextConfig } from "next";

import { baseUrl } from "./src/shared/config/api";
import {
  IMG_PROXY_PUBLIC_PATH,
  imgProxyBaseUrl,
} from "./src/shared/config/img-proxy";

import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.picsum.photos",
      },
    ],
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src", "shared", "ui"),
      path.join(__dirname, "src", "shared", "styles"),
    ],
    prependData: `@use 'helpers' as *;`,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/:path*`,
      },
      {
        source: `${IMG_PROXY_PUBLIC_PATH}/:path*`,
        destination: `${imgProxyBaseUrl}/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            prettier: false,
            svgo: true,
            ref: true,
            svgoConfig: {
              plugins: [
                "prefixIds",
                // { name: "convertStyleToAttrs" },
                { name: "removeAttrs", params: { attrs: ["fill"] } },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

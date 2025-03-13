import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',
  /* other config options here */
  images: {
    remotePatterns: [
      {
        hostname: '*.picsum.photos',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
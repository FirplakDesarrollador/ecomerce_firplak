import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.firplak.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firplak.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.delivery.rocketcdn.me',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

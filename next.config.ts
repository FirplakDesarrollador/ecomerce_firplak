import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev --webpack`: assets-fuente (renders de Blender, capturas, PNG de trabajo) no forma parte
  // de la app; escribir ahí disparaba Fast Refresh y reiniciaba la página abierta (bug 031).
  webpack: (config, { dev }) => {
    if (dev) {
      const base = config.watchOptions?.ignored;
      const propio = /(^|\/)assets-fuente(\/|$)/;
      config.watchOptions = {
        ...config.watchOptions,
        ignored: base instanceof RegExp ? new RegExp(`${base.source}|${propio.source}`) : propio,
      };
    }
    return config;
  },
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

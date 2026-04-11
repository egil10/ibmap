import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Pre-generate small sizes used for markers and cards
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp', 'image/avif'],
  },
  // Compress responses
  compress: true,

  // Enable React strict mode for better performance profiling
  reactStrictMode: false,

  // PowerPrefix for better caching
  headers: async () => [
    {
      source: '/logos/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default nextConfig;

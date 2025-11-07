import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flexoutdoor.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

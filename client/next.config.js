/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flexoutdoor.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.modules.push(path.resolve(__dirname, "../node_modules"));
    return config;
  },
};

module.exports = nextConfig;

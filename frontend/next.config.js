/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  transpilePackages: ['three'],
  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend-api-567950905652.asia-southeast1.run.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;

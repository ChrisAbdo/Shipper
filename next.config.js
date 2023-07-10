/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['public.blob.vercel-storage.com'],
  },
};

module.exports = nextConfig;

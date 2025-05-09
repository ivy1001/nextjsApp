/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc'],
  },
  experimental: {
    appDir: false, // ⛔ disable App Router
  },
};

module.exports = nextConfig;

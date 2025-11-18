/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // Убедимся, что используется pages router
  },
};

module.exports = nextConfig;

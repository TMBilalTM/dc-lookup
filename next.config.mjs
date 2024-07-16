// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configure Next.js image optimization
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

export default nextConfig;

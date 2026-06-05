/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js", "anthropic"],
  },
};

module.exports = nextConfig;

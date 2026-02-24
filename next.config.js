/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle size - SWC minification is enabled by default in Next.js 14
  swcMinify: true,
  // Note: redirects() function does NOT work with static export (output: 'export')
  // Use Cloudflare Pages _redirects file or Cloudflare Pages domain redirect settings instead
}

module.exports = nextConfig



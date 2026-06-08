/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // Static site — deploys to Netlify as-is
  trailingSlash: true,    // Ensures /about/ works on Netlify
  images: {
    unoptimized: true,    // Required for static export
  },
}

module.exports = nextConfig

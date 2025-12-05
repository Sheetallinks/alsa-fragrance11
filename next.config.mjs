/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Handle environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

export default nextConfig

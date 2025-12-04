/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Handle environment variables (must be provided in .env / Vercel)
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

export default nextConfig

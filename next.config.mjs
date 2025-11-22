/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Increase body size limit for API routes (especially file uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
  source: '/api/:path*',
  destination: 'http://backend:4000/api/:path*' // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;

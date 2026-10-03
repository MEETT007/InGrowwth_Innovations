import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['stay-sources-citations-delivers.trycloudflare.com', 'localhost'],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      // AWS S3 - used by upload API for blog thumbnails, portfolio images, etc.
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      // Cloudflare R2 or custom S3-compatible storage
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      // Cloudinary (if used)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Allow any https image source for maximum flexibility with external content
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/services/cloud-&-devops-solutions',
        destination: '/services/cloud-devops-solutions',
        permanent: true,
      },
      {
        source: '/services/ai-&-machine-learning',
        destination: '/services/ai-machine-learning',
        permanent: true,
      },
      {
        source: '/services/ai/ml',
        destination: '/services/ai-machine-learning',
        permanent: true,
      },
      {
        source: '/services/ai-ml',
        destination: '/services/ai-machine-learning',
        permanent: true,
      },
      {
        source: '/services/cloud-devops',
        destination: '/services/cloud-devops-solutions',
        permanent: true,
      },
      {
        source: '/services/cloud/devops',
        destination: '/services/cloud-devops-solutions',
        permanent: true,
      },
      {
        source: '/services/mobile-apps',
        destination: '/services/mobile-app-development',
        permanent: true,
      },
      {
        source: '/services/erp-enterprise',
        destination: '/services/erp-enterprise-software',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    // Enable App Router (should be default in Next.js 13+)
    appDir: true,
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'amora-real-estate-simulator',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      // Add other image domains as needed
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config;
  },

  // Output configuration for static export (if needed)
  // output: 'export',
  // trailingSlash: true,
  // images: { unoptimized: true },
};

module.exports = nextConfig;
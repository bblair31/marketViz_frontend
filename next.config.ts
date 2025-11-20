import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React 19 features
  experimental: {
    // Enable Partial Prerendering for streaming SSR
    ppr: true,
    // Enable React Compiler (when available)
    reactCompiler: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },

  // Turbopack configuration (used with --turbo flag)
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.financialmodelingprep.com',
      },
      {
        protocol: 'https',
        hostname: '**.alphavantage.co',
      },
    ],
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'MarketViz',
    NEXT_PUBLIC_APP_VERSION: '3.0.0',
  },

  // Redirects for old routes (if needed)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

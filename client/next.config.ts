import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/register',
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;

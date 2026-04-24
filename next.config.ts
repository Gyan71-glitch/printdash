import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'theindianberg.com' },
      { protocol: 'https', hostname: 'www.theindianberg.com' },
      { protocol: 'http', hostname: 'theindianberg.com' },
      { protocol: 'http', hostname: 'www.theindianberg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },


    ],
  },
};

export default nextConfig;

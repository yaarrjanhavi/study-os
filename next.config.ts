import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow rendering images from YouTube domains for the distraction-free player thumbnails
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/forgot-password",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081", // Backend port
        pathname: "/api/v1/**",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all for now since we use dynamic R2/CDN URLs
      },
    ],
  },
};

export default nextConfig;

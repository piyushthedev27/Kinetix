import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/app", destination: "/dashboard" },
      { source: "/app/:path*", destination: "/dashboard/:path*" },
    ];
  },
};

export default nextConfig;

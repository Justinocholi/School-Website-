import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/admin-register',
        destination: '/staff-register',
      },
      {
        source: '/admin/register',
        destination: '/staff-register',
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// URL backend (tanpa /api/v1), dipakai rewrite di bawah. Di Vercel isi env BACKEND_URL
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  // proxy /api/v1/* ke backend, jadi browser cuma bicara ke domain FE.
  // cookie login (sameSite lax) jadi first-party dan tetap terkirim walau FE & BE beda domain (mis. dua *.vercel.app)
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;

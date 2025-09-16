import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable the Next.js image optimizer in development to avoid TLS issues
    // with self-signed certs when the dev server proxies remote images.
    // In production, optimization remains enabled.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.slateai.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

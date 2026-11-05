import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    // Imagens de divulgação dos sites da vitrine da Landing.
    remotePatterns: [
      { protocol: "https", hostname: "fly.pieter.com", pathname: "/assets/**" },
      { protocol: "https", hostname: "lusion.co", pathname: "/assets/**" },
      { protocol: "https", hostname: "bruno-simon.com", pathname: "/social/**" },
    ],
  },
};

export default nextConfig;

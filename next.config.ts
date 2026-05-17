import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/anime-fav-catalog-ai",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/file/anilistcdn/**",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;

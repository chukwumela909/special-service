import type { NextConfig } from "next";

type ExtendedNextConfig = NextConfig & {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
};

const nextConfig: ExtendedNextConfig = {
  /* config options here */
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

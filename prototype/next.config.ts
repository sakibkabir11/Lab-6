import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep dev Server Action manifests separate from production build output.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;

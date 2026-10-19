import type { NextConfig } from "next";

/**
 * Project SAMAD Phase 004:
 * Enforce TypeScript validation in all builds rather than permitting
 * production output with known type errors.
 */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

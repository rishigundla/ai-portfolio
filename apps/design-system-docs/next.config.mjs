/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required in a monorepo: transpile the workspace design-system package
  // because it ships TSX source files directly (no build step).
  transpilePackages: ['@rishi/design-system', '@rishi/ai-core'],

  // Recharts / framer-motion ship as ESM — Next.js handles both natively in 15+
  reactStrictMode: true,
}

export default nextConfig

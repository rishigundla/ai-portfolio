/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required in a monorepo: transpile workspace packages that ship TSX source.
  transpilePackages: ['@rishi/design-system', '@rishi/ai-core'],
  reactStrictMode: true,
}

export default nextConfig

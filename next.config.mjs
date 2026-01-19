/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Transpile Prisma Client TypeScript files
  transpilePackages: ['@prisma/client'],
  // Server external packages - prevent Next.js from bundling these packages
  // This helps with packages that have worker files or native dependencies
  serverExternalPackages: ['pdfjs-dist', 'pdf-parse'],
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Mark pdfjs-dist and pdf-parse as external packages for Turbopack
    serverExternalPackages: ['pdfjs-dist', 'pdf-parse'],
  },
  // Webpack configuration (for --webpack flag compatibility)
  webpack: (config, { isServer }) => {
    // Allow importing .ts files from node_modules (for Prisma Client)
    if (isServer) {
      config.resolve.extensions.push('.ts', '.tsx');
      // Externalize pdfjs-dist and pdf-parse for server-side
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('pdfjs-dist', 'pdf-parse');
      }
    }
    return config;
  },
}

export default nextConfig

import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "@radix-ui/react-dialog"],
  },

  // Webpack configuration for better code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Enable code splitting for vendor chunks
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          // Three.js ecosystem
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
          // Framer Motion
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
          // Radix UI
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
          // React ecosystem
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react-vendor",
            priority: 30,
            reuseExistingChunk: true,
          },
          // Charting libraries
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: "charts-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
          // Map libraries
          maps: {
            test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
            name: "maps-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },

  // Security headers
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'wasm-unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              // Images: self + конкретные API домены
              "img-src 'self' data: blob: https://images-assets.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://*.basemaps.cartocdn.com",
              "font-src 'self' data:",
              // Connect: self + конкретные API домены
              "connect-src 'self' https://api.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://api.open-notify.org",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
            ].join(", "),
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(withNextIntl(nextConfig))

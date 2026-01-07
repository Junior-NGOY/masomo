import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      rules: {
        // Configure specific rules if needed
      }
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
        /* port: "",
        pathname: "/account123/**" */
      }
    ]
  },
  // Ignorer les avertissements de react-to-print en développement
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.ignoreWarnings = config.ignoreWarnings || [];
      config.ignoreWarnings.push({
        module: /react-to-print/,
        message: /.*was unable to load a resource.*/,
      });
    }
    return config;
  },
};

export default nextConfig;

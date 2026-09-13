import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // One address for search engines: the Vercel URL permanently forwards to the real domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "orucode.vercel.app" }],
        destination: "https://orucode.online/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

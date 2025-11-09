import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevents clickjacking attacks
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevents MIME type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Limits referrer information leakage
          },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "interest-cohort=()", // Disables FLoC tracking
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

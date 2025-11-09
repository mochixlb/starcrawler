import type { NextConfig } from "next";

/**
 * Generates Content-Security-Policy header based on environment
 *
 * Production: Strict CSP without unsafe-eval (removed for security)
 *   - script-src: 'self' only (Next.js bundles all scripts)
 *   - style-src: 'self' 'unsafe-inline' (required for Tailwind CSS 4 and Framer Motion dynamic styles)
 *
 * Development: Relaxed CSP for development convenience
 *   - script-src: Includes unsafe-eval and unsafe-inline for Next.js dev mode
 *   - style-src: Includes unsafe-inline for Tailwind CSS and Framer Motion
 */
function generateCSP(): string {
  const isProduction = process.env.NODE_ENV === "production";

  // Base directives (same for all environments)
  const baseDirectives = [
    "default-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'", // Prevents clickjacking
    "upgrade-insecure-requests",
  ];

  // Environment-specific script and style directives
  if (isProduction) {
    // Production: Strict CSP
    // - 'strict-dynamic': Required for Next.js 16 dynamic script loading and code splitting
    //   Allows scripts loaded by trusted scripts (from 'self') to execute
    // - No unsafe-eval: Framer Motion doesn't require eval() in production builds
    // - unsafe-inline for styles: Required for Tailwind CSS 4 dynamic classes and Framer Motion inline styles
    return [
      ...baseDirectives,
      "script-src 'self' 'strict-dynamic'", // Next.js 16 requires strict-dynamic for dynamic imports
      "style-src 'self' 'unsafe-inline'", // Required for Tailwind CSS 4 and Framer Motion
    ].join("; ");
  } else {
    // Development: Relaxed CSP for development convenience
    // - unsafe-eval: Required for Next.js dev mode hot reloading and source maps
    // - unsafe-inline: Required for development tooling and inline scripts/styles
    return [
      ...baseDirectives,
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Dev mode requirements
      "style-src 'self' 'unsafe-inline'", // Tailwind CSS and Framer Motion
    ].join("; ");
  }
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: generateCSP(),
          },
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

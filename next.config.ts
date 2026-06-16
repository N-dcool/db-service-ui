import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Dev-only proxy: forwards /api/* requests from the Next.js server (localhost:3000)
    // to the backend (localhost:3001) server-side, so the browser never makes a
    // cross-origin request and CORS is bypassed entirely.
    //
    // Without this, the browser would fetch http://localhost:3001 directly and
    // get blocked by CORS since 3000 and 3001 are different origins.
    //
    // In production this returns [] - the real API URL is handled via
    // NEXT_PUBLIC_API_URL or infrastructure-level routing (nginx, etc.).
    //
    // To override the backend port locally, set DEV_API_URL in .env.local:
    //   DEV_API_URL=http://localhost:8080
    if (process.env.NODE_ENV !== "development") return [];
    const backend = process.env.DEV_API_URL ?? 'http://localhost:8080';
    return [
      { source: "/api/auth/:path*", destination: `${backend}/api/auth/:path*` },
      { source: "/api/db/:path*", destination: `${backend}/api/db/:path*` },
      { source: "/api/playground/:path*", destination: `${backend}/api/playground/:path*` },
    ];
  },
};

export default nextConfig;

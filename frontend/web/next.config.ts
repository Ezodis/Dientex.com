import { withSharedDevConfig } from './next.config.shared';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Production fallback for /api calls when the browser is not pointed
  // directly at NEXT_PUBLIC_API_URL; the dev proxy already routes /api.
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!apiUrl) return [];
    const base = apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    const origin = base.startsWith('http') ? base : `https://${base}`;
    return [{ source: '/api/:path*', destination: `${origin}/api/:path*` }];
  },
};

export default withSharedDevConfig(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    // Halaman login yang sebenarnya ada di /auth/login (dibuka langsung, status 200).
    // Path lama /login diarahkan ke sana.
    return [{ source: "/login", destination: "/auth/login", permanent: false }];
  },
};

export default nextConfig;

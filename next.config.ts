import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // pure static — works on Vercel, Firebase, GitHub Pages
  images: { unoptimized: true },
};

export default nextConfig;

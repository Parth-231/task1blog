// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: false
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // This enables native browser-like scroll restoration
  // Works automatically with router.push() / router.back()
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
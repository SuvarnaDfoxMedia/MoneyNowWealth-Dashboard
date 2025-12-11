<<<<<<< HEAD
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  reactStrictMode: true,
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,

  experimental: {
    optimizeCss: true,
  },

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      // ✅ Cloudinary (https)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      // ✅ Cloudinary (http – optional but fine)
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      // ✅ Firebase Storage (IMPORTANT)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
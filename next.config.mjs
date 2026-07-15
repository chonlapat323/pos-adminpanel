/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      // Match the backend's upload limit (see backend/src/modules/uploads/uploads.controller.ts MAX_FILE_SIZE)
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

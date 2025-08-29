/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // 禁用 dev 下的缓存
    }
    return config;
  },
};

export default nextConfig;

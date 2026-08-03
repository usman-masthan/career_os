/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/credentials", destination: "/certifications", permanent: true }];
  },
};

export default nextConfig;

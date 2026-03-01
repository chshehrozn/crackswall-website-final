/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "media.imgcdn.org",
      "admin.crackfit.com",
      "crackswall.zeezsoft.com",
      "127.0.0.1",
      "localhost",
    ],
  },

  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "http://localhost:3002/images/:path*",
      },

      {
        source: "/:sitemapName.xml",
        destination: "/sitemap/:sitemapName.xml",
      },
    ];
  },
};

export default nextConfig;

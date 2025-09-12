/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://app.repspark.com"
            // For local parent testing too, use:
            // value: "frame-ancestors https://app.repspark.com http://localhost:3000"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      { source: "/", destination: "/index.html", permanent: false }
    ];
  }
};

module.exports = nextConfig;

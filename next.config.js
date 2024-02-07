/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ["ujzhjwjvxwtzwfoxacdl.supabase.co"],
  // },
  // To use a remote / external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ujzhjwjvxwtzwfoxacdl.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;

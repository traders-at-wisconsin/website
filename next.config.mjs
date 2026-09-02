/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/3vxa65y6/**',
      },
    ],
    // Required from Next 16 onward for any quality other than 75.
    qualities: [75, 90],
  },
}

export default nextConfig

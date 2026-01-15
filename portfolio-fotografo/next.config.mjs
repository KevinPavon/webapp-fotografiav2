/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Permite que Next optimize imágenes desde tu Supabase (ajusta el hostname si cambia)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oxvyfmaqbzbuoeifjkne.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*.(png|jpg|jpeg|webp|avif|gif|svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig

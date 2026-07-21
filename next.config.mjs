/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔴 1. RECUPERAMOS EL PERMISO PARA TU LOGO Y FOTOS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 🟢 2. MANTENEMOS LA REDIRECCIÓN QUE YA FUNCIONA
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'v0-menu-for-snacks.vercel.app',
          },
        ],
        destination: 'https://v0-botanamx.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
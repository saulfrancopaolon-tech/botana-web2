import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BOTA-NA | Snacks que Rompen — La Salle Bajío",
  description: "Los mejores snacks artesanales en La Salle Bajío. Cacahuates, chips, gomitas, papas y bebidas. Pide en línea vía WhatsApp.",
  icons: { icon: "/images/logo-botana.png" },
  openGraph: {
    title: "BOTA-NA | Snacks Premium",
    description: "Snacks artesanales irresistibles en La Salle Bajío, León Gto.",
    siteName: "BOTA-NA",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

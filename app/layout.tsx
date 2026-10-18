import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Intro } from "@/components/intro"
import { ScrollProgress } from "@/components/scroll-fx"
import "./globals.css"

export const metadata: Metadata = {
  title: "BOTA-NA | Snacks que Rompen — La Salle Bajío",
  description:
    "Takis, Barcel, Runners, Vualá y snacks artesanales en La Salle Bajío. Pide en línea por WhatsApp. Mayoreo y eventos para negocios.",
  icons: { icon: "/images/logo-botana.png", apple: "/images/logo-botana.png" },
  openGraph: {
    title: "BOTA-NA | Snacks Premium",
    description: "Snacks irresistibles en La Salle Bajío, León Gto. Mayoreo y eventos.",
    siteName: "BOTA-NA",
    type: "website",
    locale: "es_MX",
  },
  appleWebApp: { capable: true, title: "BOTA-NA", statusBarStyle: "black-translucent" },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* La intro se muestra una vez por sesión: si ya se vio, se oculta antes de pintar */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(sessionStorage.getItem('bn-intro')){d.dataset.intro='done'}else{d.dataset.intro='play';sessionStorage.setItem('bn-intro','1')}}catch(e){document.documentElement.dataset.intro='done'}",
          }}
        />
      </head>
      <body>
        <Intro />
        <ScrollProgress />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

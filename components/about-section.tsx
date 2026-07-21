import { Sparkles, HelpCircle, MapPin, CreditCard, Gift, MessageCircle } from "lucide-react"

export function AboutSection() {
  return (
    /* AGREGAMOS EL ID 'about' AQUÍ */
    <section id="about" className="mx-auto max-w-2xl px-4 py-16 text-white">
      
      {/* SECCIÓN: QUIÉNES SOMOS */}
      <div className="mb-16 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-[50px]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-black tracking-tight">¿Quiénes somos?</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed font-medium">
            BOTA-NA no es solo otra marca de snacks. Somos un proyecto nacido en León, Gto.,
            donde combinamos el amor por las buenas botanas con una obsesión por el diseño y la experiencia.
            Cada bolsa de papas, cada receta y cada entrega está pensada para darte el mejor
            sabor. Todo es preparado con dedicación por Saúl y Aranza.
          </p>
        </div>
      </div>

      {/* SECCIÓN: PREGUNTAS FRECUENTES (AGREGAMOS ID 'faq') */}
      <div id="faq">
        <div className="flex items-center gap-3 mb-6 px-2">
          <HelpCircle className="h-6 w-6 text-white/70" />
          <h2 className="text-xl font-black tracking-tight">Preguntas Frecuentes</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5 border border-white/5 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <h3 className="font-bold text-sm">¿Dónde entregan?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Hacemos entregas personales directamente en La universidad la Salle o hacemos entregas en todo León, Gto. Solo arma tu pedido por aquí, mándalo por WhatsApp y acordamos el punto de entrega.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-white/5 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Gift className="h-4 w-4 shrink-0" />
              <h3 className="font-bold text-sm">¿Cómo funciona la BOTA-Card?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              100% digital. Cuando nos compres, te daremos un código secreto. Mételo en esta página y junta 10 puntos para llevarte una botana gratis.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-white/5 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <CreditCard className="h-4 w-4 shrink-0" />
              <h3 className="font-bold text-sm">¿Qué métodos de pago aceptan?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Aceptamos pago en efectivo al momento de la entrega, transferencias o pagos con NFC: tarjeta, apple pay, google wallet,etc . ¡Lo que se te haga más cómodo!
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-white/5 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <h3 className="font-bold text-sm">Tengo una idea de botana, ¿puedo sugerirla?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              ¡Obvio! Nos encanta experimentar. Mándanos un DM a nuestro Instagram o dínoslo en persona. Si tu idea está chida, la sacamos.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-xs font-bold uppercase tracking-widest text-zinc-600">
        <p>Diseñado con 🖤 en León, Gto.</p>
        <p className="mt-1">© {new Date().getFullYear()} BOTA-NA</p>
      </div>
    </section>
  )
}

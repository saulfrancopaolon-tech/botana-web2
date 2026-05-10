"use client"

// ── TOAST ──
export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2.5 bg-[#181818] border border-white/10 rounded-full px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap shadow-2xl transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-[#E53E3E] flex-shrink-0" />
      {message}
    </div>
  )
}

// ── LOYALTY PROMO ──
export function LoyaltyPromo({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="py-20 px-4 bg-[#111] text-center">
      <div className="max-w-xl mx-auto">
        <div className="text-xs font-black tracking-[.2em] uppercase text-[#E53E3E] mb-2">Programa de Lealtad</div>
        <h2 className="font-head text-[clamp(2.5rem,5vw,4rem)] leading-tight mb-4">Tu BOTA-Card</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          Cada compra cuenta. Acumula 10 puntos y reclama tu snack favorito <strong className="text-white">gratis</strong>. Actívate siguiéndonos en Instagram.
        </p>
        <div className="grid grid-cols-10 gap-1.5 max-w-[280px] mx-auto mb-8">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-full flex items-center justify-center text-[.6rem] font-bold ${
                i < 3 ? "bg-[#E53E3E] text-white" : "bg-white/5 border border-white/10 text-white/20"
              }`}
            >
              {i < 3 ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-[.06em] uppercase hover:bg-[#FF5252] hover:-translate-y-0.5 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          Activar mi BOTA-Card
        </button>
      </div>
    </section>
  )
}

// ── WHOLESALE SECTION ──
export function WholesaleSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_50%,rgba(229,62,62,0.06),transparent)]" />
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="text-xs font-black tracking-[.2em] uppercase text-[#E53E3E] mb-3">Oportunidades de Negocio</div>
          <h2 className="font-head text-[clamp(3rem,6vw,5.5rem)] leading-[.93] mb-5">
            Vende<br /><span className="text-[#E53E3E]">BOTA-NA</span><br />y Gana
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
            Únete a nuestra red de distribuidores o pide para tu evento. Precios especiales de mayoreo, entrega rápida y soporte personalizado.
          </p>
          <a
            href="https://wa.me/524774950232?text=Hola!%20Me%20interesa%20información%20sobre%20mayoreo%20de%20BOTA-NA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-[.06em] uppercase hover:bg-[#FF5252] hover:-translate-y-0.5 transition-all"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Contactar por WhatsApp
          </a>
        </div>

        <div className="space-y-4">
          {[
            { emoji: "🎉", title: "Mayoreo para Eventos", desc: "Fiestas, reuniones, mesas de snacks. Cotización personalizada con precios especiales.", msg: "Hola! Me interesa MAYOREO para un evento con BOTA-NA", color: "red" },
            { emoji: "📈", title: "Sé Distribuidor", desc: "Inicia tu negocio. Precios de socio, catálogo completo y acompañamiento para arrancar.", msg: "Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA", color: "orange" },
            { emoji: "🏫", title: "Escuelas y Organizaciones", desc: "Proveedores confiables para cafeterías y kioscos escolares. Facturación disponible.", msg: "Hola! Soy de una institución y me interesa BOTA-NA para venta institucional", color: "red" },
          ].map(card => (
            <div
              key={card.title}
              className="bg-[#111] border border-white/[.07] rounded-2xl p-5 flex gap-4 items-start hover:border-[#E53E3E]/30 hover:translate-x-1 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#E53E3E]/10 flex items-center justify-center text-xl flex-shrink-0">{card.emoji}</div>
              <div>
                <div className="font-black text-white text-sm mb-1">{card.title}</div>
                <p className="text-xs text-white/35 leading-relaxed mb-3">{card.desc}</p>
                <a
                  href={`https://wa.me/524774950232?text=${encodeURIComponent(card.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#E53E3E] hover:gap-2 transition-all"
                >
                  Contactar
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SITE FOOTER ──
export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-14 text-center px-4">
      <div className="font-head text-[2.5rem] tracking-wide text-white mb-1">BOTA<span className="text-[#E53E3E]">-</span>NA</div>
      <p className="text-[11px] text-white/20 uppercase tracking-[.2em] font-bold mb-6">Snacks Premium · La Salle Bajío · León, Gto.</p>
      <div className="flex justify-center gap-6 flex-wrap mb-6">
        {[
          ["Instagram", "https://instagram.com/bota.na.mx"],
          ["WhatsApp", "https://wa.me/524774950232"],
        ].map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-white/30 hover:text-white transition-colors uppercase tracking-widest font-bold"
          >{label}</a>
        ))}
      </div>
      <p className="text-[11px] text-white/15 uppercase tracking-[.15em]">© 2025 BOTA-NA por Saúl &amp; Aranza</p>
    </footer>
  )
}

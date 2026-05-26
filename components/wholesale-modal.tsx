"use client"
import { useEffect } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
  onEventOpen: () => void
}

export function WholesaleModal({ isOpen, onClose, onEventOpen }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  if (!isOpen) return null

  const options = [
    {
      emoji: "🎉",
      title: "Eventos y Fiestas",
      desc: "Cotizador con precios especiales de evento, descuentos por volumen y etiquetas personalizadas con el tema de tu fiesta.",
      cta: "Cotizar mi evento",
      accent: true,
      action: "event" as const,
    },
    {
      emoji: "📦",
      title: "Mayoreo",
      desc: "Pedidos desde 30 piezas con precios de mayoreo. Ideal para revender o surtir tu negocio.",
      cta: "Contactar por WhatsApp",
      accent: false,
      msg: "Hola! Me interesa hacer un pedido de MAYOREO con BOTA-NA. Quisiera informacion sobre precios y cantidades minimas.",
      action: "wa" as const,
    },
    {
      emoji: "📈",
      title: "Distribuidor",
      desc: "Conviertete en distribuidor oficial. Precios preferenciales para pedidos recurrentes de 100+ piezas.",
      cta: "Quiero ser distribuidor",
      accent: false,
      msg: "Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA. Quisiera informacion sobre precios y condiciones.",
      action: "wa" as const,
    },
    {
      emoji: "🏫",
      title: "Institucional",
      desc: "Proveedores para cafeterias, kioscos y tiendas de escuelas u organizaciones.",
      cta: "Solicitar informacion",
      accent: false,
      msg: "Hola! Soy de una institucion y me interesa BOTA-NA para venta institucional.",
      action: "wa" as const,
    },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 className="font-head text-[2rem] leading-none mb-1">Oportunidades</h2>
        <p className="text-white/40 text-sm mb-5">Lleva BOTA-NA a otro nivel</p>

        <div className="space-y-3">
          {options.map(card => (
            <div
              key={card.title}
              className={"rounded-2xl p-4 border transition-all " + (card.accent ? "bg-gradient-to-br from-[#F97316]/10 to-[#E53E3E]/10 border-[#F97316]/25" : "bg-white/[.03] border-white/[.07]")}
            >
              <div className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0 mt-0.5">{card.emoji}</span>
                <div className="flex-1">
                  <div className="font-black text-white text-sm mb-1">{card.title}</div>
                  <p className="text-[.72rem] text-white/40 leading-relaxed mb-3">{card.desc}</p>
                  {card.action === "event" ? (
                    <button
                      onClick={() => { onClose(); onEventOpen() }}
                      className="inline-flex items-center gap-1.5 text-[.7rem] font-black uppercase tracking-widest text-[#F97316] hover:gap-2.5 transition-all"
                    >
                      {card.cta}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  ) : (
                    <a
                      href={"https://wa.me/524774950232?text=" + encodeURIComponent(card.msg || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[.7rem] font-black uppercase tracking-widest text-[#E53E3E] hover:gap-2.5 transition-all"
                    >
                      {card.cta}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div className="mt-5 bg-white/[.02] border border-white/[.05] rounded-2xl p-4">
          <p className="text-[.6rem] font-black uppercase tracking-[.2em] text-white/25 text-center mb-3">Niveles de precio</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[.62rem] font-black text-[#F97316] uppercase tracking-wider mb-1">Evento</div>
              <div className="text-[.68rem] text-white/50 leading-snug">Precio especial</div>
              <div className="text-[.58rem] text-white/25 mt-1">+ dscto por volumen</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[.62rem] font-black text-white/70 uppercase tracking-wider mb-1">Mayoreo</div>
              <div className="text-[.68rem] text-white/50 leading-snug">30+ piezas</div>
              <div className="text-[.58rem] text-white/25 mt-1">Precio preferencial</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[.62rem] font-black text-white/70 uppercase tracking-wider mb-1">Distribuidor</div>
              <div className="text-[.68rem] text-white/50 leading-snug">100+ piezas</div>
              <div className="text-[.58rem] text-white/25 mt-1">Mejor precio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

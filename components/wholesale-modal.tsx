"use client"
import { useEffect } from "react"

interface Props { isOpen: boolean; onClose: () => void }

export function WholesaleModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-lg max-h-[88vh] overflow-y-auto p-6 sm:p-8 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h2 className="font-head text-[2.5rem] leading-tight mb-1 mt-1">Oportunidades</h2>
        <p className="text-white/40 text-sm mb-7">Lleva el sabor de BOTA-NA a otro nivel</p>

        <div className="space-y-4">
          {[
            {
              emoji: "🎉",
              title: "Mayoreo para Eventos",
              desc: "Fiestas, reuniones y mesas de snacks. Cotización personalizada con precios especiales de volumen para tu evento.",
              cta: "Cotizar mi evento",
              msg: "Hola! Me interesa pedir MAYOREO para un evento con BOTA-NA",
              accent: false
            },
            {
              emoji: "📈",
              title: "Sé Distribuidor",
              desc: "Inicia tu propio negocio de snacks con BOTA-NA. Precios de socio, catálogo completo y acompañamiento para arrancar.",
              cta: "Quiero ser distribuidor",
              msg: "Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA",
              accent: true
            },
            {
              emoji: "🏫",
              title: "Escuelas y Organizaciones",
              desc: "Proveedores confiables para cafeterías, kioscos y tiendas escolares. Facturación disponible.",
              cta: "Solicitar información",
              msg: "Hola! Soy de una escuela o institución y me interesa BOTA-NA para venta institucional",
              accent: false
            },
          ].map(card => (
            <div
              key={card.title}
              className={`rounded-2xl p-5 border transition-all ${
                card.accent
                  ? "bg-gradient-to-br from-[#E53E3E]/10 to-[#F97316]/10 border-[#E53E3E]/25"
                  : "bg-white/[.04] border-white/[.07]"
              }`}
            >
              <div className="flex gap-3 items-start">
                <span className="text-2xl">{card.emoji}</span>
                <div className="flex-1">
                  <div className="font-black text-white mb-1">{card.title}</div>
                  <p className="text-xs text-white/40 leading-relaxed mb-4">{card.desc}</p>
                  <a
                    href={`https://wa.me/524774950232?text=${encodeURIComponent(card.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                      card.accent ? "text-[#F97316]" : "text-[#E53E3E]"
                    }`}
                  >
                    {card.cta}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

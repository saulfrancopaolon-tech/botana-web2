"use client"
import Link from "next/link"

interface Props {
  onMenuClick: () => void
  onLoyaltyOpen: () => void
}

/**
 * HomeBlocks — el "home screen" de la app.
 * Organiza la web en los 2 bloques que pidio el cliente:
 *  1) TIENDA GENERAL  → universitarios, catalogo + BOTA-Card de fidelidad
 *  2) MAYOREO         → distribuidores / eventos, lleva a /b2b
 */
export function HomeBlocks({ onMenuClick, onLoyaltyOpen }: Props) {
  return (
    <section className="px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-20 pb-2">
      <div className="max-w-5xl mx-auto">
        <div className="ios-section-label mb-3">Elige tu experiencia</div>

        <div className="grid sm:grid-cols-2 gap-3.5">

          {/* ── BLOQUE 1 · TIENDA GENERAL ── */}
          <button
            onClick={onMenuClick}
            className="ios-app-card text-left p-5 sm:p-6 flex flex-col justify-between min-h-[184px]"
            style={{ background: "linear-gradient(155deg,#1a1010,#0f0a08 60%)" }}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 ios-icon-badge flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#E53E3E,#B01E1E)" }}>
                🌶️
              </div>
              <span className="text-[.6rem] font-black uppercase tracking-widest text-white/25 pt-1">01</span>
            </div>
            <div className="mt-5">
              <h3 className="font-head text-[1.9rem] leading-none text-white mb-1.5">Tienda General</h3>
              <p className="text-white/40 text-[.78rem] leading-relaxed mb-4 max-w-[92%]">
                Catálogo completo, pedidos por WhatsApp y tu <span className="text-white/70 font-medium">BOTA-Card</span> de fidelidad. Pensado para ti, universitario.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[.68rem] font-black uppercase tracking-wider text-[#E53E3E]">
                  Ver menú
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
                <span
                  onClick={e => { e.stopPropagation(); onLoyaltyOpen() }}
                  className="inline-flex items-center gap-1.5 text-[.68rem] font-black uppercase tracking-wider text-white/35 hover:text-white/70 transition-colors"
                >
                  · Mi tarjeta
                </span>
              </div>
            </div>
          </button>

          {/* ── BLOQUE 2 · MAYOREO ── */}
          <Link
            href="/b2b"
            className="ios-app-card text-left p-5 sm:p-6 flex flex-col justify-between min-h-[184px]"
            style={{ background: "linear-gradient(155deg,#1a1408,#0f0c08 60%)" }}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 ios-icon-badge flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#F97316,#C2570A)" }}>
                📦
              </div>
              <span className="text-[.6rem] font-black uppercase tracking-widest text-white/25 pt-1">02</span>
            </div>
            <div className="mt-5">
              <h3 className="font-head text-[1.9rem] leading-none text-white mb-1.5">Mayoreo &amp; Eventos</h3>
              <p className="text-white/40 text-[.78rem] leading-relaxed mb-4 max-w-[92%]">
                Precios por volumen, paquetes para fiestas y alianzas con distribuidores. Para negocios.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[.68rem] font-black uppercase tracking-wider text-[#F97316]">
                Ir al portal de negocios
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}

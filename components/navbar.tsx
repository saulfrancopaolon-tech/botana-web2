"use client"
import { useCart } from "./cart-context"

interface NavBarProps {
  onCartOpen: () => void
  onLoyaltyOpen: () => void
  onWholesaleOpen: () => void
}

export function NavBar({ onCartOpen, onLoyaltyOpen, onWholesaleOpen }: NavBarProps) {
  const { totalItems } = useCart()

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="font-head text-3xl tracking-wide text-white leading-none">
          BOTA<span className="text-[#E53E3E]">-</span>NA
        </div>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            Instagram
          </a>
          <button onClick={onLoyaltyOpen}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            Mi Tarjeta
          </button>
          <button onClick={onWholesaleOpen}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[.72rem] font-bold tracking-widest uppercase text-white bg-gradient-to-r from-[#F97316] to-[#E53E3E] hover:opacity-90 transition-all">
            Mayoreo
          </button>
          <button onClick={onCartOpen}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/[.04] text-[.72rem] font-bold uppercase text-white hover:border-[#F97316] hover:text-[#F97316] transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {totalItems > 0 ? "(" + String(totalItems) + ")" : "Carrito"}
            {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.55rem] font-black flex items-center justify-center">{totalItems}</span>}
          </button>
        </div>
        {/* Mobile: solo carrito arriba */}
        <button onClick={onCartOpen} className="sm:hidden relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.52rem] font-black flex items-center justify-center">{totalItems}</span>}
        </button>
      </nav>

      {/* ── BOTTOM NAV (mobile only) ── */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="bg-[#0D0D0D] border-t border-white/[.08] flex items-stretch h-[60px]">

          {/* Menu */}
          <a href="#menu" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white/40 active:text-white active:bg-white/5 transition-colors">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
              <line x1="9" y1="12" x2="15" y2="12"/>
              <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
            <span className="text-[.5rem] font-black uppercase tracking-wide">Menu</span>
          </a>

          {/* Puntos */}
          <button onClick={onLoyaltyOpen} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white/40 active:text-white active:bg-white/5 transition-colors">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            <span className="text-[.5rem] font-black uppercase tracking-wide">Puntos</span>
          </button>

          {/* Mayoreo — boton central destacado */}
          <button onClick={onWholesaleOpen} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            <div className="absolute -top-4 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.4)]" style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="text-[.5rem] font-black uppercase tracking-wide text-[#F97316] mt-5">Mayoreo</span>
          </button>

          {/* Instagram */}
          <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white/40 active:text-white active:bg-white/5 transition-colors">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            <span className="text-[.5rem] font-black uppercase tracking-wide">Instagram</span>
          </a>

          {/* Carrito */}
          <button onClick={onCartOpen} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative text-white/40 active:text-white active:bg-white/5 transition-colors">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="text-[.5rem] font-black uppercase tracking-wide">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-3.5 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.52rem] font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </div>
    </>
  )
}

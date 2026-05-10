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
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/5">
      <div className="font-head text-3xl tracking-wide text-white leading-none">
        BOTA<span className="text-[#E53E3E]">-</span>NA
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://instagram.com/bota.na.mx"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          Instagram
        </a>
        <button
          onClick={onLoyaltyOpen}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          <span className="hidden sm:inline">Mi Tarjeta</span>
        </button>
        <button
          onClick={onWholesaleOpen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[.72rem] font-bold tracking-widest uppercase text-white bg-gradient-to-r from-[#F97316] to-[#E53E3E] hover:opacity-90 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Mayoreo
        </button>
        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/[.04] text-[.72rem] font-bold tracking-wider uppercase text-white hover:border-[#F97316] hover:text-[#F97316] transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {totalItems > 0 ? `(${totalItems})` : "Carrito"}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.55rem] font-black flex items-center justify-center">{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  )
}

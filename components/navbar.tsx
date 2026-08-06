"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "./cart-context"

interface NavBarProps {
  onCartOpen: () => void
  onLoyaltyOpen: () => void
}

export function NavBar({ onCartOpen, onLoyaltyOpen }: NavBarProps) {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isTienda = pathname === "/"

  return (
    <>
      {/* ── TOP NAV — estilo iOS: glass + segmented control Tienda/Mayoreo ── */}
      <nav
        className={
          "sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 gap-3 " +
          "bg-[#0A0A0A]/80 backdrop-blur-2xl border-b transition-all duration-300 " +
          (scrolled ? "h-14 border-white/10" : "h-16 border-white/5")
        }
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link
          href="/"
          className={
            "ios-large-title text-white leading-none flex-shrink-0 transition-all " +
            (scrolled ? "text-[1.5rem]" : "text-[1.8rem]")
          }
        >
          BOTA<span className="text-[#E53E3E]">-</span>NA
        </Link>

        {/* Segmented control — el corazon de la navegacion en 2 bloques */}
        <div className="ios-segmented flex-shrink-0">
          <Link href="/" data-active={isTienda}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            <span className="hidden xs:inline">Tienda</span>
          </Link>
          <Link href="/b2b" data-active={!isTienda}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="hidden xs:inline">Mayoreo</span>
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 active:scale-95 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            Instagram
          </a>
          {isTienda && (
            <button onClick={onLoyaltyOpen}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-[.72rem] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:border-white/30 active:scale-95 transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
              Mi Tarjeta
            </button>
          )}
          {isTienda ? (
            <button onClick={onCartOpen}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/[.04] text-[.72rem] font-bold uppercase text-white hover:border-[#F97316] hover:text-[#F97316] active:scale-95 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {totalItems > 0 ? "(" + String(totalItems) + ")" : "Carrito"}
              {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.55rem] font-black flex items-center justify-center">{totalItems}</span>}
            </button>
          ) : (
            <a href="https://wa.me/524774950232?text=Hola!%20Vi%20la%20pagina%20de%20BOTA-NA%20para%20negocios%20y%20me%20interesa%20conocer%20mas."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[.72rem] font-bold tracking-widest uppercase text-white bg-gradient-to-r from-[#F97316] to-[#E53E3E] active:scale-95 transition-all">
              Contactar
            </a>
          )}
        </div>

        {/* Mobile: solo carrito arriba (en Tienda) */}
        {isTienda ? (
          <button onClick={onCartOpen} className="sm:hidden relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-all flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E53E3E] text-white text-[.52rem] font-black flex items-center justify-center">{totalItems}</span>}
          </button>
        ) : (
          <a href="https://wa.me/524774950232?text=Hola!%20Vi%20la%20pagina%20de%20BOTA-NA%20para%20negocios%20y%20me%20interesa%20conocer%20mas."
            target="_blank" rel="noopener noreferrer"
            className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
        )}
      </nav>

      {/* ── BOTTOM TAB BAR (mobile only) — estilo iOS Tab Bar ── */}
      {isTienda && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="bg-[#0D0D0D]/95 backdrop-blur-2xl border-t border-white/[.08] flex items-stretch h-[60px]">

            <a href="#menu" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white active:bg-white/5 transition-colors relative">
              <div className="ios-tab-active-dot bg-[#F97316]" style={{ left: "50%", marginLeft: -2 }} />
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
              <span className="text-[.5rem] font-black uppercase tracking-wide">Tienda</span>
            </a>

            <button onClick={onLoyaltyOpen} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white/40 active:text-white active:bg-white/5 transition-colors">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
                <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
              <span className="text-[.5rem] font-black uppercase tracking-wide">Puntos</span>
            </button>

            {/* Mayoreo — lleva al bloque dedicado /b2b, boton central destacado */}
            <Link href="/b2b" className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
              <div className="absolute -top-4 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.4)]" style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="text-[.5rem] font-black uppercase tracking-wide text-[#F97316] mt-5">Mayoreo</span>
            </Link>

            <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white/40 active:text-white active:bg-white/5 transition-colors">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              <span className="text-[.5rem] font-black uppercase tracking-wide">Instagram</span>
            </a>

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
      )}
    </>
  )
}

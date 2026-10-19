"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "./cart-context"

interface NavBarProps {
  onCartOpen: () => void
  onLoyaltyOpen: () => void
}

const WA_B2B = "https://wa.me/524774950232?text=Hola!%20Vi%20la%20pagina%20de%20BOTA-NA%20para%20negocios%20y%20me%20interesa%20conocer%20mas."

const I = {
  bag:  <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  gift: <><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>,
  store:<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  ig:   <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
}
const Icon = ({ d, s = 20 }: { d: React.ReactNode; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
)

export function NavBar({ onCartOpen, onLoyaltyOpen }: NavBarProps) {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isTienda = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* ── TOP BAR · vidrio ── */}
      <nav
        className={
          "sticky top-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-8 transition-all duration-500 " +
          (scrolled ? "h-14 bg-black/55 backdrop-blur-2xl border-b border-white/10" : "h-16 bg-transparent border-b border-transparent")
        }
        style={{ paddingTop: "env(safe-area-inset-top)", WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : undefined }}
      >
        <Link href="/" className="font-head text-[1.45rem] text-white" aria-label="BOTA-NA inicio">
          BOTA<span className="text-grad">-</span>NA
        </Link>

        {/* Selector Tienda / Mayoreo */}
        <div className="ios-segmented flex-shrink-0">
          <Link href="/" data-active={isTienda}>Tienda</Link>
          <Link href="/b2b" data-active={!isTienda}>Mayoreo</Link>
        </div>

        {/* Acciones escritorio */}
        <div className="hidden sm:flex items-center gap-2">
          {isTienda && (
            <button onClick={onLoyaltyOpen} className="btn-ghost !px-4 !py-2 !text-[.8rem]">
              <Icon d={I.gift} s={15} /> Mi tarjeta
            </button>
          )}
          {isTienda ? (
            <button onClick={onCartOpen} className="btn-primary !px-4 !py-2 !text-[.8rem] relative">
              <Icon d={I.cart} s={15} />
              Carrito
              {totalItems > 0 && <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[.7rem] font-bold text-black">{totalItems}</span>}
            </button>
          ) : (
            <a href={WA_B2B} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !py-2 !text-[.8rem]">Contactar</a>
          )}
        </div>

        {/* Móvil: carrito arriba */}
        {isTienda ? (
          <button onClick={onCartOpen} aria-label="Abrir carrito" className="tap sm:hidden relative grid h-10 w-10 place-items-center rounded-full glass-2 text-white">
            <Icon d={I.cart} s={18} />
            {totalItems > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#FF3B30] px-1 text-[.62rem] font-bold text-white animate-scale-pop">{totalItems}</span>}
          </button>
        ) : (
          <a href={WA_B2B} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="sm:hidden grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
          </a>
        )}
      </nav>

      {/* ── TAB BAR FLOTANTE (móvil) ── */}
      {isTienda && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 px-4 pointer-events-none" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}>
          <div className="pointer-events-auto mx-auto flex max-w-sm items-center justify-between rounded-[28px] glass-2 px-2 py-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)]">
            <TabLink href="#menu" label="Tienda" active icon={I.bag} />
            <TabBtn onClick={onLoyaltyOpen} label="Puntos" icon={I.gift} />
            <Link href="/b2b" className="relative -mt-7 flex flex-col items-center" aria-label="Mayoreo">
              <span className="grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_10px_28px_-4px_rgba(255,59,48,.7)]" style={{ background: "var(--grad-brand)" }}>
                <Icon d={I.store} s={24} />
              </span>
              <span className="mt-1 text-[.6rem] font-semibold text-white/80">Mayoreo</span>
            </Link>
            <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="tap flex w-14 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white">
              <Icon d={I.ig} /><span className="text-[.6rem] font-semibold">Insta</span>
            </a>
            <button onClick={onCartOpen} className="tap relative flex w-14 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white" aria-label="Carrito">
              <Icon d={I.cart} /><span className="text-[.6rem] font-semibold">Carrito</span>
              {totalItems > 0 && <span className="absolute right-2 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#FF3B30] px-1 text-[.62rem] font-bold text-white animate-scale-pop">{totalItems}</span>}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function TabLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <a href={href} className={"tap flex w-14 flex-col items-center gap-0.5 py-1.5 " + (active ? "text-white" : "text-white/50")}>
      <Icon d={icon} /><span className="text-[.6rem] font-semibold">{label}</span>
    </a>
  )
}
function TabBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button onClick={onClick} className="tap flex w-14 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white">
      <Icon d={icon} /><span className="text-[.6rem] font-semibold">{label}</span>
    </button>
  )
}

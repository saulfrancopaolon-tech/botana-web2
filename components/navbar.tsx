 "use client";
  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { useCart } from "./cart-context";

  const WA_B2B = "https://wa.me/524774950232?text=Hola!%20Vi%20la%20pagina%20de%20BOTA-NA%20para%20negocios%20y%20me%20interesa%20conocer%20mas.";

  const I = {
    bag:  <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
    gift: <><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0
  0-5C13 2 12 7 12 7z" /></>,
    store:<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
    ig:   <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
    cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
  };

  const Icon = ({ d, s = 20 }: { d: React.ReactNode; s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );

  export function NavBar({ onCartOpen, onLoyaltyOpen }: NavBarProps) {
    const { totalItems } = useCart();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const isTienda = pathname === "/";

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
      <>
        {/* ── TOP BAR · vidrio iOS ── */}
        <nav
          className={
            "sticky top-0 z-50 flex items-center justify-between gap-2 px-3 sm:px-4 transition-all duration-300 " +
            (scrolled
              ? "h-14 bg-black/5 backdrop-blur-lg border-b border-white/10"
              : "h-16 bg-transparent border-b border-transparent")
          }
          style={{
            paddingTop: "env(safe-area-inset-top)",
            WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : undefined
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[1.5rem] font-bold tracking-tight text-white">BOTA</span>
            <span className="text-[1.5rem] font-bold tracking-tight text-gradient-primary">-</span>
            <span className="text-[1.5rem] font-bold tracking-tight text-white">NA</span>
          </Link>

          {/* Selector Tienda / Mayoreo */}
          <div className="ios-segmented flex-shrink-0 hidden sm:block">
            <Link
              href="/"
              data-active={isTienda}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isTienda
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Tienda
            </Link>
            <Link
              href="/b2b"
              data-active={!isTienda}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                !isTienda
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Mayoreo
            </Link>
          </div>

          {/* Acciones escritorio */}
          <div className="hidden sm:flex items-center gap-2">
            {isTienda && (
              <button
                onClick={onLoyaltyOpen}
                className="btn-ios btn-ios-outline px-4 py-2 text-sm flex items-center gap-1.5 tap-feedback"
                aria-label="Abrir tarjeta de lealtad"
              >
                <Icon d={I.gift} s={16} />
                <span>Mi tarjeta</span>
              </button>
            )}
            {isTienda ? (
              <button
                onClick={onCartOpen}
                className="btn-ios btn-ios-primary px-4 py-2 text-sm flex items-center gap-1.5 relative tap-feedback"
                aria-label="Abrir carrito"
              >
                <Icon d={I.cart} s={16} />
                <span>Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[.7rem] font-medium text-black">
                    {totalItems}
                  </span>
                )}
              </button>
            ) : (
              <a
                href={WA_B2B}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ios btn-ios-primary px-4 py-2 text-sm flex items-center gap-1.5 tap-feedback"
              >
                <Icon d={I.cart} s={16} />
                <span>Contactar</span>
              </a>
            )}
          </div>

          {/* Móvil: botones de acción */}
          <div className="sm:hidden flex items-center gap-2">
            {isTienda ? (
              <>
                <button
                  onClick={onLoyaltyOpen}
                  className="tap-feedback p-2 rounded-lg bg-white/10 hover:bg-white/15"
                  aria-label="Abrir tarjeta de lealtad"
                >
                  <Icon d={I.gift} s={18} />
                </button>
                <button
                  onClick={onCartOpen}
                  className="relative tap-feedback p-2 rounded-lg bg-white/10 hover:bg-white/15"
                  aria-label="Abrir carrito"
                >
                  <Icon d={I.cart} s={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[.65rem] font-medium text-white">
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <a
                href={WA_B2B}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-feedback p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30"
                aria-label="Contactar por WhatsApp"
              >
                <Icon d={I.cart} s={18} className="text-white" />
              </a>
            )}
          </div>
        </nav>

        {/* ── TAB BAR FLOTANTE (móvil) ── */}
        {isTienda && (
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 px-3 pointer-events-none" style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 12px)"
          }}>
            <div className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-[28px] glass-2 px-2 py-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,.3)]">
              <TabLink href="#menu" label="Tienda" active icon={I.bag} />
              <TabBtn onClick={onLoyaltyOpen} label="Puntos" icon={I.gift} />
              <Link href="/b2b" className="relative -mt-6 flex flex-col items-center" aria-label="Mayoreo">
                <span className="grid h-12 w-12 place-items-center rounded-full text-white shadow-[0_8px_20px_-3px_rgba(255,59,48,.4)]" style={{ background: "var(--grad-brand)"
  }}>
                  <Icon d={I.store} s={20} />
                </span>
                <span className="mt-1 text-[.6rem] font-semibold text-white/80">Mayoreo</span>
              </Link>
              <a
                href="https://instagram.com/bota.na.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-12 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white"
              >
                <Icon d={I.ig} />
                <span className="text-[.6rem] font-semibold">Insta</span>
              </a>
              <button
                onClick={onCartOpen}
                className="relative flex w-12 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white"
                aria-label="Carrito"
              >
                <Icon d={I.cart} />
                <span className="text-[.6rem] font-semibold">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[.65rem] font-medium text-white">
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

  function TabLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active?: boolean }) {
    return (
      <a
        href={href}
        className={"flex w-12 flex-col items-center gap-0.5 py-1.5 " + (active ? "text-white" : "text-white/50")}
        className="tap-feedback"
      >
        <Icon d={icon} s={18} />
        <span className="text-[.6rem] font-semibold">{label}</span>
      </a>
    )
  }
  function TabBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className="flex w-12 flex-col items-center gap-0.5 py-1.5 text-white/50 active:text-white tap-feedback"
      >
        <Icon d={icon} s={18} />
        <span className="text-[.6rem] font-semibold">{label}</span>
      </button>
    )
  }

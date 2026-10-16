"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { CATEGORIES, PRODUCTS } from "@/lib/products"
import type { Product } from "@/lib/products"
import { CartProvider } from "@/components/cart-context"
import { NavBar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { CategoryTabs } from "@/components/category-tabs"
import { ProductGrid } from "@/components/product-grid"
import { CartModal } from "@/components/cart-modal"
import { LoyaltyModal } from "@/components/loyalty-modal"
import { Toast, LoyaltyPromo } from "@/components/ui-components"
import { AnimateIn } from "@/components/animations"

const SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQKeuTywAmniswIKciTQS0hI-fMIm4l0DRiGATcUpA_eff42eVS6171CngdgtGphWUADrllm5dcxe1/pub?output=csv"

export default function Page() {
  const [activeCat, setActiveCat] = useState("Todos")
  const [query, setQuery] = useState("")
  const [stockData, setStockData] = useState<Record<number, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [loyaltyOpen, setLoyaltyOpen] = useState(false)
  const [toast, setToast] = useState({ msg: "", show: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touch = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null)

  useEffect(() => {
    fetch(SHEETS_CSV)
      .then(r => r.text())
      .then(csv => {
        const stock: Record<number, boolean> = {}
        csv.split("\n").slice(1).forEach(row => {
          const cols = row.split(",")
          if (cols.length >= 3) {
            const id = parseInt(cols[0].trim())
            if (!isNaN(id)) stock[id] = cols[2].trim().toUpperCase() === "SI"
          }
        })
        setStockData(stock)
      })
      .catch(() => {})
  }, [])

  const showToast = useCallback((p: Product) => {
    setToast({ msg: p.name + " agregado", show: true })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2200)
  }, [])

  const products: Product[] = useMemo(
    () => PRODUCTS.map(p => ({ ...p, inStock: stockData[p.id] !== undefined ? stockData[p.id] : true })),
    [stockData]
  )

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const filtered = useMemo(() => {
    if (searching) {
      return products.filter(p =>
        (p.name + " " + p.flavor + " " + p.cat + " " + (p.brand ?? "") + " " + p.desc).toLowerCase().includes(q)
      )
    }
    return activeCat === "Todos" ? products : products.filter(p => p.cat === activeCat)
  }, [products, activeCat, q, searching])

  const scrollToMenu = useCallback(() => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const pickCategory = useCallback((cat: string) => {
    setQuery("")
    setActiveCat(cat)
    setTimeout(scrollToMenu, 30)
  }, [scrollToMenu])

  // Deslizar para cambiar de categoría (solo cuenta el gesto horizontal)
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dy: 0 }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const t = touch.current
    if (!t) return
    t.dx = e.touches[0].clientX - t.x
    t.dy = e.touches[0].clientY - t.y
  }
  const onTouchEnd = () => {
    const t = touch.current
    touch.current = null
    if (!t || searching || activeCat === "Todos") return
    if (Math.abs(t.dx) > Math.abs(t.dy) * 1.6 && Math.abs(t.dx) > 80) {
      const idx = CATEGORIES.indexOf(activeCat)
      if (t.dx < 0 && idx < CATEGORIES.length - 1) setActiveCat(CATEGORIES[idx + 1])
      else if (t.dx > 0 && idx > 0) setActiveCat(CATEGORIES[idx - 1])
    }
  }

  const showRails = !searching && activeCat === "Todos"

  return (
    <CartProvider>
      <NavBar onCartOpen={() => setCartOpen(true)} onLoyaltyOpen={() => setLoyaltyOpen(true)} />

      <Hero onMenuClick={scrollToMenu} onPickCategory={pickCategory} />

      {/* ── MENÚ ── */}
      <main id="menu">
        {/* Barra pegajosa: buscador + categorías */}
        <div className="sticky top-14 z-40 border-y border-white/[.06] bg-black/60 backdrop-blur-2xl" style={{ WebkitBackdropFilter: "blur(24px) saturate(180%)" }}>
          <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6">
            <label className="flex items-center gap-2.5 rounded-2xl bg-white/[.07] px-3.5 py-2.5 focus-within:bg-white/[.11] focus-within:ring-1 focus-within:ring-white/20 transition">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar Takis, chips, gomitas…"
                inputMode="search"
                enterKeyHint="search"
                aria-label="Buscar productos"
                className="w-full bg-transparent text-[.95rem] text-white placeholder:text-white/35 outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[.7rem] text-black">✕</button>
              )}
            </label>
          </div>
          <div className="mx-auto max-w-7xl">
            <CategoryTabs categories={CATEGORIES} active={searching ? "" : activeCat} onSelect={cat => { setQuery(""); setActiveCat(cat) }} />
          </div>
        </div>

        <section
          className="mx-auto min-h-[70vh] max-w-7xl px-4 pb-16 pt-7 sm:px-6"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!showRails && (
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-head text-[1.9rem] sm:text-4xl text-white">
                  {searching ? "Resultados" : activeCat}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                  {searching ? " para “" + query.trim() + "”" : ""}
                </p>
              </div>
            </div>
          )}

          <ProductGrid
            products={filtered}
            showGroups={showRails}
            onAddToCart={showToast}
            onSeeAll={cat => { setActiveCat(cat); setTimeout(scrollToMenu, 30) }}
          />
        </section>
      </main>

      <LoyaltyPromo onOpen={() => setLoyaltyOpen(true)} />

      {/* ── CTA a Mayoreo ── */}
      <section className="px-4 py-16 sm:py-24">
        <AnimateIn className="mx-auto max-w-4xl">
          <a
            href="/b2b"
            className="group relative flex flex-col gap-6 overflow-hidden rounded-[32px] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            style={{ background: "linear-gradient(135deg,#1c1c1f 0%,#141416 100%)", border: "1px solid rgba(255,255,255,.08)" }}
          >
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-80" style={{ background: "radial-gradient(circle,#FF9F0A,transparent 70%)" }} />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-[.16em] text-[#FF9F0A]">Para negocios y eventos</div>
              <h3 className="font-head mt-2 text-[clamp(1.8rem,5vw,2.8rem)] text-white">¿Compras por volumen?</h3>
              <p className="mt-2 max-w-md text-sm text-white/50">Surte tu cafetería, tienda o evento con precios de mayoreo. Cotiza en minutos.</p>
            </div>
            <span className="btn-primary relative self-start sm:self-auto">
              Ver mayoreo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </a>
        </AnimateIn>
      </section>

      <footer className="border-t border-white/[.06] px-4 pb-32 pt-12 text-center sm:pb-12">
        <div className="font-head text-4xl text-white">BOTA<span className="text-grad">-</span>NA</div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[.2em] text-white/30">Snacks Premium · La Salle Bajío · León, Gto.</p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-white/45">
          <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Instagram</a>
          <a href="https://wa.me/524774950232" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">WhatsApp</a>
          <a href="/b2b" className="transition-colors hover:text-white">Mayoreo</a>
        </div>
        <p className="mt-6 text-[11px] text-white/20">2025 BOTA-NA por Saúl y Aranza</p>
      </footer>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoyaltyModal isOpen={loyaltyOpen} onClose={() => setLoyaltyOpen(false)} />
      <Toast message={toast.msg} show={toast.show} />
    </CartProvider>
  )
}

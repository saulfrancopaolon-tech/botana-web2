"use client"

import { useState, useEffect, useCallback } from "react"
import { CATEGORIES, PRODUCTS } from "@/lib/products"
import type { Product } from "@/lib/products"
import { CartProvider } from "@/components/cart-context"
import { Marquee } from "@/components/marquee"
import { NavBar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { CategoryTabs } from "@/components/category-tabs"
import { ProductGrid } from "@/components/product-grid"
import { ProductList } from "@/components/product-list"
import { CartModal } from "@/components/cart-modal"
import { LoyaltyModal } from "@/components/loyalty-modal"
import { Toast, LoyaltyPromo } from "@/components/ui-components"

const SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQKeuTywAmniswIKciTQS0hI-fMIm4l0DRiGATcUpA_eff42eVS6171CngdgtGphWUADrllm5dcxe1/pub?output=csv"

export default function Page() {
  const [activeCat, setActiveCat] = useState("Todos")
  const [stockData, setStockData] = useState<Record<number, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [loyaltyOpen, setLoyaltyOpen] = useState(false)
  const [toast, setToast] = useState({ msg: "", show: false })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

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
    setToast({ msg: p.name + " agregado al carrito", show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }, [])

  const products: Product[] = PRODUCTS.map(p => ({
    ...p,
    inStock: stockData[p.id] !== undefined ? stockData[p.id] : true,
  }))

  const filtered = activeCat === "Todos"
    ? products
    : products.filter(p => p.cat === activeCat)

  // Todos = carousel grid, categoria especifica = lista acordeon
  const showGrid = activeCat === "Todos"

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  }
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dx = touchStart.x - touchEnd.x
    const dy = touchStart.y - touchEnd.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 70) {
      const idx = CATEGORIES.indexOf(activeCat)
      if (dx > 0 && idx < CATEGORIES.length - 1) setActiveCat(CATEGORIES[idx + 1])
      else if (dx < 0 && idx > 0) setActiveCat(CATEGORIES[idx - 1])
    }
  }

  return (
    <CartProvider>
      <Marquee />
      <NavBar
        onCartOpen={() => setCartOpen(true)}
        onLoyaltyOpen={() => setLoyaltyOpen(true)}
      />

      {/* ── HERO: protagonista de la pagina ── */}
      <Hero
        onMenuClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* ── MENU: el producto es lo primero que se ve despues del hero ── */}
      <div id="menu" className="animate-fade-in">
        {/* Sticky category tabs */}
        <div className="sticky top-14 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5">
          <CategoryTabs
            categories={CATEGORIES}
            active={activeCat}
            onSelect={cat => {
              setActiveCat(cat)
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
            }}
          />
        </div>

        {/* Category header for non-Todos views */}
        {activeCat !== "Todos" && (
          <div
            className="px-4 sm:px-6 pt-5 pb-3"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h2 className="font-head text-[2rem] leading-none text-white">{activeCat}</h2>
                <p className="text-[.7rem] text-white/30 mt-0.5">
                  {filtered.length} productos
                  <span className="ml-2 text-white/20">Desliza para cambiar categoria</span>
                </p>
              </div>
              {/* Swipe hint dots */}
              <div className="flex gap-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={
                      "transition-all rounded-full " +
                      (cat === activeCat
                        ? "w-4 h-1.5 bg-[#E53E3E]"
                        : "w-1.5 h-1.5 bg-white/20")
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 min-h-[60vh]"
          style={{ paddingTop: activeCat === "Todos" ? "1.5rem" : "0" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {showGrid ? (
            /* Todos: carousel group cards */
            <ProductGrid
              products={filtered}
              onProductClick={() => {}}
              onAddToCart={p => showToast(p)}
              showGroups={true}
            />
          ) : (
            /* Categoria: lista acordeon */
            <ProductList
              products={filtered}
              onAddToCart={p => showToast(p)}
            />
          )}
        </section>
      </div>

      <LoyaltyPromo onOpen={() => setLoyaltyOpen(true)} />

      {/* ── CTA unico hacia el portal de Mayoreo ── */}
      <section className="px-4 pb-16 sm:pb-14">
        <div className="max-w-2xl mx-auto">
          <a
            href="/b2b"
            className="ios-app-card flex items-center justify-between gap-4 p-5 sm:p-6"
            style={{ background: "linear-gradient(120deg,#1a1408,#120d09)" }}
          >
            <div>
              <div className="text-[.62rem] font-black uppercase tracking-[.18em] text-[#F97316] mb-1.5">
                Para negocios y eventos
              </div>
              <div className="font-head text-[1.65rem] leading-none text-white mb-1">
                ¿Compras por volumen?
              </div>
              <p className="text-white/40 text-[.78rem] leading-snug">
                Cotiza tu pedido de mayoreo o evento en minutos.
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 pb-24 sm:pb-12 text-center px-4">
        <div className="font-head text-4xl tracking-wide text-white mb-1">
          BOTA<span className="text-red-500">-</span>NA
        </div>
        <p className="text-[11px] text-white/25 uppercase tracking-[.2em] font-bold mb-6">
          Snacks Premium · La Salle Bajio · Leon, Gto.
        </p>
        <div className="flex justify-center gap-6 flex-wrap mb-4">
          <a
            href="https://instagram.com/bota.na.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-white/40 hover:text-white transition-colors uppercase tracking-wider font-semibold"
          >
            Instagram
          </a>
          <a
            href="https://wa.me/524774950232"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-white/40 hover:text-white transition-colors uppercase tracking-wider font-semibold"
          >
            WhatsApp
          </a>
        </div>
        <p className="text-[11px] text-white/15 uppercase tracking-[.15em]">
          2025 BOTA-NA por Saul y Aranza
        </p>
      </footer>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoyaltyModal isOpen={loyaltyOpen} onClose={() => setLoyaltyOpen(false)} />
      <Toast message={toast.msg} show={toast.show} />
    </CartProvider>
  )
}

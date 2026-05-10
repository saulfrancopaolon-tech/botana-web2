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
import { ProductModal } from "@/components/product-modal"
import { CartModal } from "@/components/cart-modal"
import { LoyaltyModal } from "@/components/loyalty-modal"
import { WholesaleModal } from "@/components/wholesale-modal"
import { Toast, LoyaltyPromo, WholesaleSection } from "@/components/ui-components"

const SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQKeuTywAmniswIKciTQS0hI-fMIm4l0DRiGATcUpA_eff42eVS6171CngdgtGphWUADrllm5dcxe1/pub?output=csv"

export default function Page() {
  const [activeCat, setActiveCat] = useState("🔥 Top")
  const [stockData, setStockData] = useState<Record<number, boolean>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loyaltyOpen, setLoyaltyOpen] = useState(false)
  const [wholesaleOpen, setWholesaleOpen] = useState(false)
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

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }, [])

  const products: Product[] = PRODUCTS.map(p => ({
    ...p,
    inStock: stockData[p.id] !== undefined ? stockData[p.id] : true,
  }))

  const filtered = activeCat === "🔥 Top"
    ? products.filter(p => p.pop)
    : activeCat === "Todos"
    ? products
    : products.filter(p => p.cat === activeCat)

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
        onWholesaleOpen={() => setWholesaleOpen(true)}
      />
      <Hero
        onMenuClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
        onWholesaleOpen={() => setWholesaleOpen(true)}
      />
      <div id="menu" className="sticky top-16 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5">
        <CategoryTabs categories={CATEGORIES} active={activeCat} onSelect={setActiveCat} />
      </div>
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 min-h-[60vh]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ProductGrid
          products={filtered}
          onProductClick={setSelectedProduct}
          onAddToCart={(p) => showToast(`${p.name} agregado 🛒`)}
        />
      </section>
      <LoyaltyPromo onOpen={() => setLoyaltyOpen(true)} />
      <WholesaleSection />
      <footer className="border-t border-white/5 py-12 text-center px-4">
        <div className="font-head text-4xl tracking-wide text-white mb-1">BOTA<span className="text-red-500">-</span>NA</div>
        <p className="text-[11px] text-white/25 uppercase tracking-[.2em] font-bold mb-6">Snacks Premium · La Salle Bajío · León, Gto.</p>
        <div className="flex justify-center gap-6 flex-wrap mb-6">
          <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/40 hover:text-white transition-colors uppercase tracking-wider font-semibold">Instagram</a>
          <a href="https://wa.me/524774950232" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/40 hover:text-white transition-colors uppercase tracking-wider font-semibold">WhatsApp</a>
        </div>
        <p className="text-[11px] text-white/20 uppercase tracking-[.15em]">© 2025 BOTA-NA por Saúl &amp; Aranza</p>
      </footer>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={showToast} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoyaltyModal isOpen={loyaltyOpen} onClose={() => setLoyaltyOpen(false)} />
      <WholesaleModal isOpen={wholesaleOpen} onClose={() => setWholesaleOpen(false)} />
      <Toast message={toast.msg} show={toast.show} />
    </CartProvider>
  )
}

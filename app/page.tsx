"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Toast, LoyaltyPromo, WholesaleSection, SiteFooter } from "@/components/ui-components"

export const CATEGORIES = ["🔥 Top", "Todos", "Cacahuates", "Chips", "Gomitas", "Papas", "Bebidas"]

export const PRODUCTS = [
  { id: 1,  name: "Cacahuate Holandés Habanero", desc: "Cacahuates holandeses con el intenso sabor del chile habanero. Crujientes y picosísimos.", price: 15, cat: "Cacahuates", tags: ["100g"], pop: true,  spicy: true,  natural: false, emoji: "🥜", img: "/images/4.webp"  },
  { id: 2,  name: "Cacahuate Holandés Jalapeño", desc: "Cacahuates holandeses con el sabor clásico del chile jalapeño. El balance perfecto.",    price: 15, cat: "Cacahuates", tags: ["100g"], pop: false, spicy: true,  natural: false, emoji: "🥜", img: "/images/3.webp"  },
  { id: 3,  name: "Cacahuate Holandés Rojo",     desc: "Cacahuates holandeses sazonados al estilo rojo. Tradicionales y llenos de sabor.",       price: 15, cat: "Cacahuates", tags: ["100g"], pop: false, spicy: false, natural: false, emoji: "🥜", img: "/images/2.webp"  },
  { id: 4,  name: "Betabel Botana",               desc: "Chips crujientes de betabel natural. Snack saludable con sabor único y color intenso.",   price: 25, cat: "Chips",      tags: ["60g","Natural"], pop: true,  spicy: false, natural: true,  emoji: "🫚", img: "/images/6.webp"  },
  { id: 5,  name: "Jícama Botana",                desc: "Chips de jícama ligeras y crujientes. El snack perfecto bajo en calorías.",               price: 25, cat: "Chips",      tags: ["60g","Natural"], pop: false, spicy: false, natural: true,  emoji: "🥗", img: "/images/8.webp"  },
  { id: 6,  name: "Taro Botana",                  desc: "Chips exóticas de taro con sabor suave y textura única. Diferente y delicioso.",          price: 25, cat: "Chips",      tags: ["60g","Gourmet"], pop: false, spicy: false, natural: true,  emoji: "🫙", img: "/images/7.webp"  },
  { id: 7,  name: "Camote Botana",                desc: "Láminas de camote natural deshidratadas. Un snack dulce-salado súper crujiente.",         price: 25, cat: "Chips",      tags: ["60g","Natural"], pop: true,  spicy: false, natural: true,  emoji: "🍠", img: "/images/19.webp" },
  { id: 8,  name: "Goma Aros de Durazno",         desc: "Aros de gomita con sabor a durazno. Dulces, suaves y deliciosas.",                        price: 15, cat: "Gomitas",    tags: ["100g"], pop: false, spicy: false, natural: false, emoji: "🍑", img: "/images/9.webp"  },
  { id: 9,  name: "Goma Lombriz Enchilada",        desc: "Gusanos de gomita enchilados sabor pepino. El snack ácido-picoso que todos quieren.",     price: 15, cat: "Gomitas",    tags: ["100g"], pop: true,  spicy: true,  natural: false, emoji: "🪱", img: "/images/12.webp" },
  { id: 10, name: "Goma Oso Lucky Enchilada",      desc: "Ositos de gomita suaves por dentro enchilados con chile. Un clásico mexicano.",           price: 15, cat: "Gomitas",    tags: ["100g"], pop: true,  spicy: true,  natural: false, emoji: "🐻", img: "/images/11.webp" },
  { id: 11, name: "Goma Tiburón Lucky",            desc: "Gomitas en forma de tiburón con sabor frutal. Divertidas y deliciosas.",                  price: 15, cat: "Gomitas",    tags: ["100g"], pop: false, spicy: false, natural: false, emoji: "🦈", img: "/images/18.webp" },
  { id: 12, name: "Papa Natural",                  desc: "Papas fritas artesanales con sal natural. El clásico sabor crujiente de siempre.",        price: 20, cat: "Papas",      tags: ["60g"], pop: false, spicy: false, natural: false, emoji: "🥔", img: "/images/13.webp" },
  { id: 13, name: "Papa Adobada",                  desc: "Papas sazonadas con adobo mexicano tradicional. Sabor intenso e irresistible.",           price: 20, cat: "Papas",      tags: ["60g"], pop: true,  spicy: true,  natural: false, emoji: "🌶️", img: "/images/14.webp" },
  { id: 14, name: "Papa Fuego",                    desc: "Papas con el máximo nivel de picante. Solo para los más valientes. ¿Te atreves?",         price: 20, cat: "Papas",      tags: ["60g"], pop: true,  spicy: true,  natural: false, emoji: "🔥", img: "/images/15.webp" },
  { id: 15, name: "Agua de Jamaica",               desc: "Refrescante agua de jamaica natural infusionada en frío. Sin conservadores.",             price: 22, cat: "Bebidas",    tags: ["500ml","Natural"], pop: false, spicy: false, natural: true,  emoji: "🌺", img: "/images/70.webp" },
  { id: 16, name: "Mangonada",                     desc: "Deliciosa combinación de mango natural y chamoy. La bebida del verano todo el año.",      price: 30, cat: "Bebidas",    tags: ["Fresco","Frutal"], pop: true,  spicy: true,  natural: false, emoji: "🥭", img: "/images/69.webp" },
]

const SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQKeuTywAmniswIKciTQS0hI-fMIm4l0DRiGATcUpA_eff42eVS6171CngdgtGphWUADrllm5dcxe1/pub?output=csv"

export type Product = (typeof PRODUCTS)[number] & { inStock?: boolean }

export default function Page() {
  const [activeCat, setActiveCat] = useState("🔥 Top")
  const [stockData, setStockData] = useState<Record<number, boolean>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loyaltyOpen, setLoyaltyOpen] = useState(false)
  const [wholesaleOpen, setWholesaleOpen] = useState(false)
  const [toast, setToast] = useState({ msg: "", show: false })

  /* Swipe support */
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

      <Hero onMenuClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} onWholesaleOpen={() => setWholesaleOpen(true)} />

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

      <footer className="border-t border-white/5 py-12 text-center">
        <div className="font-head text-4xl tracking-wide text-white mb-1">BOTA<span className="text-red-500">-</span>NA</div>
        <p className="text-[11px] text-white/25 uppercase tracking-[.2em] font-bold mb-6">Snacks Premium · La Salle Bajío · León, Gto.</p>
        <div className="flex justify-center gap-6 flex-wrap mb-6">
          {[["Instagram", "https://instagram.com/bota.na.mx"], ["WhatsApp", `https://wa.me/524774950232`]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/40 hover:text-white transition-colors uppercase tracking-wider font-semibold">{label}</a>
          ))}
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

"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useCart } from "./cart-context"
import type { Product } from "@/lib/products"
import { PRODUCTS } from "@/lib/products"
import { ProductList } from "./product-list"

interface GridProps {
  products: Product[]
  onAddToCart: (p: Product) => void
  showGroups: boolean
  onProductClick?: (p: Product) => void
}

const CAT_ORDER = ["Cacahuates", "Chips", "Gomitas", "Papas", "Bebidas"]

const CAT_META: Record<string, { color: string; bg: string; label: string }> = {
  Cacahuates: { color: "#F97316", bg: "rgba(249,115,22,0.12)", label: "Cacahuates" },
  Chips:      { color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  label: "Chips"      },
  Gomitas:    { color: "#ec4899", bg: "rgba(236,72,153,0.12)",  label: "Gomitas"    },
  Papas:      { color: "#E53E3E", bg: "rgba(229,62,62,0.12)",   label: "Papas"      },
  Bebidas:    { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   label: "Bebidas"    },
}

// Tick sincronizado: cambia cada 2s para todos los carruseles
const TICK_MS = 2200

export function ProductGrid({ products, onAddToCart, showGroups }: GridProps) {
  const { addItem } = useCart()
  // Shared tick for synchronized carousel
  const [tick, setTick] = useState(0)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  useEffect(() => {
    if (!showGroups) return
    const id = setInterval(() => setTick(t => t + 1), TICK_MS)
    return () => clearInterval(id)
  }, [showGroups])

  if (!products.length) {
    return (
      <div className="text-center py-20 text-white/30">
        <p className="text-4xl mb-3">🌶</p>
        <p className="text-sm uppercase tracking-widest font-bold">
          Proximamente mas sorpresas...
        </p>
      </div>
    )
  }

  // showGroups = "Todos" view — category cards
  if (showGroups) {
    return (
      <div className="space-y-3">
        {CAT_ORDER.map(cat => {
          const catProducts = products.filter(p => p.cat === cat)
          if (!catProducts.length) return null
          const meta = CAT_META[cat]
          const isOpen = expandedCat === cat
          const activeIdx = tick % catProducts.length
          const active = catProducts[activeIdx]

          return (
            <CategoryCard
              key={cat}
              cat={cat}
              meta={meta}
              products={catProducts}
              activeIdx={activeIdx}
              activeProduct={active}
              isOpen={isOpen}
              onToggle={() => setExpandedCat(prev => (prev === cat ? null : cat))}
              onAddToCart={p => { addItem(p); onAddToCart(p) }}
              tick={tick}
            />
          )
        })}
      </div>
    )
  }

  // Category view — plain accordion list (handled by ProductList in page.tsx)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map(p => (
        <SingleCard
          key={p.id}
          product={p}
          onQuickAdd={e => { e.stopPropagation(); addItem(p); onAddToCart(p) }}
        />
      ))}
    </div>
  )
}

// ── CATEGORY CARD ──
interface CategoryCardProps {
  cat: string
  meta: { color: string; bg: string; label: string }
  products: Product[]
  activeIdx: number
  activeProduct: Product
  isOpen: boolean
  onToggle: () => void
  onAddToCart: (p: Product) => void
  tick: number
}

function CategoryCard({
  cat, meta, products, activeIdx, activeProduct, isOpen, onToggle, onAddToCart, tick
}: CategoryCardProps) {
  return (
    <div
      className={
        "rounded-[1.6rem] border overflow-hidden transition-all duration-400 " +
        (isOpen
          ? "border-opacity-50"
          : "border-white/[.07] hover:border-white/20")
      }
      style={isOpen ? { borderColor: meta.color + "44", background: meta.bg } : { background: "#111" }}
    >
      {/* ── CARD HEADER (always visible) ── */}
      <button
        className="w-full flex items-stretch gap-0 text-left"
        onClick={onToggle}
      >
        {/* Big image - left side */}
        <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden" style={{ minHeight: "130px" }}>
          {/* Rotating product images */}
          {products.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-6xl select-none bg-[#181818]">
                {p.emoji}
              </div>
              <Image
                src={p.img}
                alt={p.name}
                fill
                className="object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            </div>
          ))}
          {/* Color accent bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: meta.color }}
          />
          {/* Product count badge */}
          <div
            className="absolute top-2 left-2 text-[.58rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{ background: meta.color + "cc" }}
          >
            {products.length} productos
          </div>
        </div>

        {/* Right info */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            {/* Category title */}
            <div
              className="text-[.62rem] font-black uppercase tracking-[.18em] mb-1"
              style={{ color: meta.color }}
            >
              {cat}
            </div>
            {/* Active product name */}
            <div className="font-head text-[1.4rem] leading-none text-white mb-2 truncate">
              {activeProduct.flavor ?? activeProduct.name}
            </div>
            {/* Active product price */}
            <div className="font-mono font-black text-[1rem] text-white">
              ${activeProduct.price}
              <span className="text-white/25 text-[.65rem] font-normal ml-1">MXN c/u</span>
            </div>
          </div>

          {/* Bottom row: dots + chevron */}
          <div className="flex items-center justify-between mt-3">
            {/* Synchronized dots */}
            <div className="flex gap-1">
              {products.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIdx ? "16px" : "6px",
                    height: "6px",
                    background: i === activeIdx ? meta.color : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
            {/* Chevron */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
              style={
                isOpen
                  ? { background: meta.color, transform: "rotate(180deg)" }
                  : { background: "rgba(255,255,255,0.08)" }
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* ── EXPANDED: product accordion list ── */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: isOpen ? String(products.length * 120 + 300) + "px" : "0px" }}
      >
        <div className="px-3 pb-3">
          <div className="h-px bg-white/[.06] mb-3" />
          <ProductList products={products} onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  )
}

// ── SINGLE CARD (used in non-Todos category view fallback) ──
interface SingleCardProps {
  product: Product
  onQuickAdd: (e: React.MouseEvent) => void
}

function SingleCard({ product: p, onQuickAdd }: SingleCardProps) {
  return (
    <div
      className={
        "group bg-[#111] border border-white/[.07] rounded-[1.4rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E53E3E]/30 " +
        (!p.inStock ? "opacity-40 pointer-events-none" : "")
      }
    >
      <div className="aspect-square bg-[#181818] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500 select-none">
          {p.emoji}
        </div>
        <Image
          src={p.img}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {p.pop && p.inStock && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-[#E53E3E] text-white px-2 py-0.5 rounded-full">
              Top
            </span>
          )}
          {p.spicy && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316] px-2 py-0.5 rounded-full">
              Picante
            </span>
          )}
          {!p.inStock && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="font-bold text-[.85rem] text-white leading-tight mb-1">{p.name}</div>
        <div className="text-[.7rem] text-white/35 leading-snug mb-3 line-clamp-2">{p.desc}</div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono font-bold text-white text-[1rem]">${p.price}</span>
          <button
            onClick={onQuickAdd}
            className="w-8 h-8 rounded-full bg-[#E53E3E] flex items-center justify-center hover:bg-[#FF5252] hover:scale-110 transition-all flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

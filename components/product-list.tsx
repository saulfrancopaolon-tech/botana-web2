"use client"
import { useState } from "react"
import Image from "next/image"
import { useCart } from "./cart-context"
import type { Product } from "@/lib/products"

interface Props {
  products: Product[]
  onAddToCart: (p: Product) => void
}

export function ProductList({ products, onAddToCart }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const { addItem } = useCart()

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

  function getQty(id: number) {
    return quantities[id] ?? 1
  }

  function setQty(id: number, qty: number) {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }))
  }

  function toggle(id: number) {
    setExpandedId(prev => (prev === id ? null : id))
    if (!quantities[id]) setQuantities(prev => ({ ...prev, [id]: 1 }))
  }

  function handleAdd(p: Product) {
    const qty = getQty(p.id)
    addItem(p, qty)
    onAddToCart(p)
    setExpandedId(null)
  }

  return (
    <div className="space-y-2.5">
      {products.map(p => {
        const isOpen = expandedId === p.id
        const qty = getQty(p.id)

        return (
          <div
            key={p.id}
            className={
              "rounded-2xl border overflow-hidden transition-all duration-300 " +
              (isOpen
                ? "border-[#E53E3E]/40 bg-[#161616]"
                : "border-white/[.07] bg-[#111] hover:border-white/15")
            }
          >
            {/* ── COLLAPSED ROW ── */}
            <button
              className="w-full flex items-center gap-3 p-3.5 text-left"
              onClick={() => p.inStock !== false && toggle(p.id)}
              disabled={p.inStock === false}
            >
              {/* Image / emoji */}
              <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] relative flex-shrink-0 overflow-hidden flex items-center justify-center">
                <span className="text-3xl select-none">{p.emoji}</span>
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                {/* Out of stock overlay */}
                {p.inStock === false && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[.5rem] font-black uppercase tracking-wider text-white/60">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div
                      className={
                        "font-bold text-[.9rem] leading-tight truncate " +
                        (p.inStock === false ? "text-white/30" : "text-white")
                      }
                    >
                      {p.name}
                    </div>
                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {p.spicy && (
                        <span className="text-[.55rem] font-black uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/25 px-1.5 py-0.5 rounded-full">
                          Picante
                        </span>
                      )}
                      {p.natural && (
                        <span className="text-[.55rem] font-black uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                          Natural
                        </span>
                      )}
                      {p.tags.map(t => (
                        <span
                          key={t}
                          className="text-[.55rem] text-white/25 font-bold uppercase tracking-wider"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Price + chevron */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-mono font-black text-[1.05rem] text-white">
                      ${p.price}
                    </span>
                    <div
                      className={
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 " +
                        (isOpen ? "bg-[#E53E3E] rotate-45" : "bg-white/8")
                      }
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.8"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* ── EXPANDED CONTENT ── */}
            <div
              className={
                "overflow-hidden transition-all duration-300 ease-in-out " +
                (isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0")
              }
            >
              <div className="px-4 pb-4">
                {/* Divider */}
                <div className="h-px bg-white/[.06] mb-3.5" />

                {/* Description */}
                <p className="text-[.8rem] text-white/45 leading-relaxed mb-4">
                  {p.desc}
                </p>

                {/* Qty + Add row */}
                <div className="flex items-center gap-3">
                  {/* Qty controls */}
                  <div className="flex items-center gap-3 bg-white/[.05] border border-white/[.08] rounded-full px-4 py-2.5">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setQty(p.id, qty - 1)
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm hover:bg-white/20 active:scale-90 transition-all"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-white w-4 text-center text-sm">
                      {qty}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setQty(p.id, qty + 1)
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm hover:bg-white/20 active:scale-90 transition-all"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleAdd(p)
                    }}
                    className="flex-1 py-3 rounded-full bg-[#E53E3E] text-white font-black text-[.8rem] tracking-widest uppercase hover:bg-[#FF5252] active:scale-[.98] transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Agregar
                    {qty > 1 && (
                      <span className="font-mono opacity-70">
                        ${p.price * qty}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

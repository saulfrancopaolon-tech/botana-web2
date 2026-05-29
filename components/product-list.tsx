"use client"
import { useState, useRef } from "react"
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
      <div className="text-center py-16 text-white/30">
        <p className="text-4xl mb-3">🌶</p>
        <p className="text-sm uppercase tracking-widest font-bold">Proximamente...</p>
      </div>
    )
  }

  function getQty(id: number) { return quantities[id] ?? 1 }
  function setQty(id: number, qty: number) {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }))
  }

  function toggle(id: number) {
    setExpandedId(prev => (prev === id ? null : id))
    if (!quantities[id]) setQuantities(prev => ({ ...prev, [id]: 1 }))
  }

  function handleAdd(p: Product) {
    addItem(p, getQty(p.id))
    onAddToCart(p)
    // Small delay before closing for satisfaction
    setTimeout(() => setExpandedId(null), 120)
  }

  return (
    <div className="space-y-2">
      {products.map((p, index) => {
        const isOpen = expandedId === p.id
        const qty = getQty(p.id)
        const isAvailable = p.inStock !== false

        return (
          <div
            key={p.id}
            className="rounded-2xl border overflow-hidden"
            style={{
              background: isOpen ? "#161616" : "#111",
              borderColor: isOpen ? "rgba(229,62,62,0.35)" : "rgba(255,255,255,0.07)",
              transition: "background 0.3s ease, border-color 0.3s ease",
              animationDelay: String(index * 40) + "ms",
            }}
          >
            {/* ── ROW ── */}
            <button
              className="w-full flex items-center gap-3 p-3.5 text-left"
              onClick={() => isAvailable && toggle(p.id)}
              disabled={!isAvailable}
            >
              {/* Thumbnail */}
              <div
                className="w-[62px] h-[62px] rounded-xl bg-[#1a1a1a] relative flex-shrink-0 overflow-hidden flex items-center justify-center"
                style={{
                  transform: isOpen ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span className="text-3xl select-none">{p.emoji}</span>
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                    <span className="text-[.45rem] font-black uppercase tracking-wider text-white/50 text-center leading-tight px-1">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-bold text-[.88rem] leading-tight"
                      style={{ color: isAvailable ? "white" : "rgba(255,255,255,0.3)" }}
                    >
                      {p.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {p.spicy && (
                        <span className="text-[.52rem] font-black uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-1.5 py-0.5 rounded-full">
                          Picante
                        </span>
                      )}
                      {p.natural && (
                        <span className="text-[.52rem] font-black uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                          Natural
                        </span>
                      )}
                      {p.tags.map(t => (
                        <span key={t} className="text-[.52rem] text-white/20 font-bold uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Price + icon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-mono font-black text-[1rem] text-white">
                      ${p.price}
                    </span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isOpen ? "#E53E3E" : "rgba(255,255,255,0.08)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* ── EXPANDED BODY (grid accordion) ── */}
            <div
              className="accordion-body"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div>
                <div className="px-4 pb-4">
                  <div
                    className="h-px bg-white/[.06] mb-3"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                  />

                  <p
                    className="text-[.78rem] text-white/45 leading-relaxed mb-4"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(6px)",
                      transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94) 0.05s",
                    }}
                  >
                    {p.desc}
                  </p>

                  {/* Controls */}
                  <div
                    className="flex items-center gap-3"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(8px)",
                      transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s",
                    }}
                  >
                    {/* Qty */}
                    <div className="flex items-center gap-3 bg-white/[.05] border border-white/[.07] rounded-full px-4 py-2.5">
                      <button
                        onClick={e => { e.stopPropagation(); setQty(p.id, qty - 1) }}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm hover:bg-white/20 transition-all"
                        style={{ transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-white w-4 text-center text-sm">
                        {qty}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setQty(p.id, qty + 1) }}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm hover:bg-white/20 transition-all"
                        style={{ transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleAdd(p) }}
                      className="flex-1 py-3 rounded-full bg-[#E53E3E] text-white font-black text-[.78rem] tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,62,62,0.3)]"
                      style={{ transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Agregar
                      {qty > 1 && (
                        <span className="opacity-65 font-mono text-[.72rem]">
                          ${p.price * qty}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

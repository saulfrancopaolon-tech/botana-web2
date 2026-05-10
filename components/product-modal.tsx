"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useCart } from "./cart-context"
import type { Product } from "@/app/page"

interface Props { product: Product | null; onClose: () => void; onAddToCart: (msg: string) => void }

export function ProductModal({ product, onClose, onAddToCart }: Props) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (product) setQty(1)
    document.body.style.overflow = product ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [product])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!product) return null

  const handle = () => {
    addItem(product, qty)
    onAddToCart(`${product.name} x${qty} agregado 🛒`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] rounded-b-none sm:rounded-[2rem] w-full sm:max-w-[440px] max-h-[90vh] overflow-y-auto p-5 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Swipe handle */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Image */}
        <div className="w-full aspect-[4/3] bg-[#181818] rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center">
          <span className="text-7xl select-none">{product.emoji}</span>
          <Image
            src={product.img} alt={product.name} fill className="object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        </div>

        <h2 className="font-head text-[2.2rem] leading-tight mb-1">{product.name}</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{product.desc}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {product.tags.map(t => (
            <span key={t} className="text-[.65rem] font-black tracking-widest uppercase bg-green-500/10 border border-green-500/25 text-green-400 px-2.5 py-1 rounded-full">{t}</span>
          ))}
          {product.spicy && <span className="text-[.65rem] font-black tracking-widest uppercase bg-[#F97316]/10 border border-[#F97316]/25 text-[#F97316] px-2.5 py-1 rounded-full">🌶 Picante</span>}
        </div>

        <div className="font-mono font-bold text-[1.6rem] mb-5">${product.price} <span className="text-sm text-white/30 font-normal">MXN</span></div>

        {/* Qty */}
        <div className="flex items-center gap-4 mb-5">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xl hover:border-[#E53E3E] hover:text-[#E53E3E] transition-all">−</button>
          <span className="font-mono font-bold text-xl w-8 text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xl hover:border-[#E53E3E] hover:text-[#E53E3E] transition-all">+</button>
          <span className="text-white/30 text-sm ml-auto">= <span className="text-white font-mono font-bold">${product.price * qty}</span></span>
        </div>

        <button
          onClick={handle}
          className="w-full py-4 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-[.08em] uppercase hover:bg-[#FF5252] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Agregar al Carrito
        </button>
      </div>
    </div>
  )
}

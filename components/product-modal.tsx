"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useCart } from "./cart-context"
import type { Product } from "@/lib/products"

interface Props {
  product: Product | null
  onClose: () => void
  onAddToCart: (msg: string) => void
}

export function ProductModal({ product, onClose, onAddToCart }: Props) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (product) setQty(1)
    document.body.style.overflow = product ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [product])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  if (!product) return null

  function handleAdd() {
    addItem(product!, qty)
    onAddToCart(product!.name + " x" + String(qty) + " agregado")
    onClose()
  }

  const subtotal = product.price * qty

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-sm max-h-[92vh] overflow-y-auto z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Swipe handle mobile */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-0 sm:hidden" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all z-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Image */}
        <div className="w-full aspect-[4/3] bg-[#181818] relative flex items-center justify-center overflow-hidden">
          <span className="text-8xl select-none">{product.emoji}</span>
          <Image
            src={product.img}
            alt={product.name}
            fill
            className="object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
          />
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.spicy && (
              <span className="text-[.6rem] font-black tracking-wider uppercase bg-[#F97316] text-white px-2.5 py-1 rounded-full shadow-lg">
                Picante
              </span>
            )}
            {product.natural && (
              <span className="text-[.6rem] font-black tracking-wider uppercase bg-[#22c55e] text-white px-2.5 py-1 rounded-full shadow-lg">
                Natural
              </span>
            )}
            {!product.inStock && (
              <span className="text-[.6rem] font-black tracking-wider uppercase bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                Agotado
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-6">
          {/* Name + price row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-head text-[1.9rem] leading-none text-white flex-1">
              {product.name}
            </h2>
            <div className="text-right flex-shrink-0">
              <div className="font-mono font-black text-[1.5rem] text-white leading-none">
                ${product.price}
              </div>
              <div className="text-[.6rem] text-white/25 uppercase tracking-wider">MXN c/u</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.map(t => (
              <span key={t} className="text-[.6rem] font-black tracking-widest uppercase bg-white/5 border border-white/10 text-white/40 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Desc */}
          <p className="text-white/45 text-sm leading-relaxed mb-5">
            {product.desc}
          </p>

          {/* Qty selector */}
          <div className="bg-white/[.04] border border-white/[.06] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[.68rem] font-black uppercase tracking-widest text-white/30">
                Cantidad
              </span>
              <span className="text-[.68rem] font-black uppercase tracking-widest text-white/30">
                Subtotal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white text-xl font-bold hover:border-[#E53E3E] hover:text-[#E53E3E] active:scale-95 transition-all"
                >
                  -
                </button>
                <span className="font-mono font-black text-2xl text-white w-6 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white text-xl font-bold hover:border-[#E53E3E] hover:text-[#E53E3E] active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <div className="font-mono font-black text-[1.6rem] text-white leading-none">
                  ${subtotal}
                </div>
              </div>
            </div>
          </div>

          {/* Add button */}
          {product.inStock ? (
            <button
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-widest uppercase hover:bg-[#FF5252] active:scale-[.98] transition-all flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(229,62,62,0.3)]"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Agregar al Carrito
            </button>
          ) : (
            <div className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white/30 font-black text-sm tracking-widest uppercase text-center">
              Producto Agotado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

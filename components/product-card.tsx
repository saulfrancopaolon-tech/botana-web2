"use client"
import Image from "next/image"
import { memo, useState } from "react"
import { useCart } from "./cart-context"
import type { Product } from "@/lib/products"

export const CAT_COLOR: Record<string, string> = {
  Botanas: "#FF3B30",
  Cacahuates: "#FF9F0A",
  Chips: "#FFD60A",
  Gomitas: "#FF375F",
  Papas: "#FF453A",
  Bebidas: "#30D158",
  Dulces: "#AC8E68",
}

interface Props {
  product: Product
  onAdd: (p: Product) => void
  /** Tamaño fijo para rails horizontales */
  rail?: boolean
  priority?: boolean
}

function ProductCardBase({ product: p, onAdd, rail, priority }: Props) {
  const { items, addItem } = useCart()
  const [done, setDone] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const inCart = items.find(i => i.id === p.id)?.qty ?? 0
  const color = CAT_COLOR[p.cat] ?? "#FF3B30"
  const available = p.inStock !== false

  function add(e: React.MouseEvent) {
    e.stopPropagation()
    if (!available) return
    addItem(p)
    onAdd(p)
    setDone(true)
    setTimeout(() => setDone(false), 900)
  }

  return (
    <article
      className={"pcard " + (rail ? "w-[158px] sm:w-[210px] " : "") + (!available ? "opacity-50" : "")}
    >
      {/* Imagen */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: "radial-gradient(120% 90% at 50% 12%, " + color + "38 0%, transparent 62%), #1b1b1e" }}
      >
        {/* Fallback emoji mientras no haya imagen */}
        <div className="pimg absolute inset-0 grid place-items-center text-[4.5rem] sm:text-[5.5rem] select-none drop-shadow-[0_12px_20px_rgba(0,0,0,.45)]">
          {p.emoji}
        </div>
        {imgOk && (
          <Image
            src={p.img}
            alt={p.name}
            fill
            sizes="(max-width:640px) 45vw, 220px"
            priority={priority}
            onError={() => setImgOk(false)}
            className={"pimg " + (p.fit === "contain" ? "object-contain p-5" : "object-cover")}
          />
        )}

        {/* Etiquetas */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {p.isNew && available && (
            <span className="rounded-full bg-white px-2 py-[3px] text-[.6rem] font-bold uppercase tracking-wide text-black">Nuevo</span>
          )}
          {p.pop && !p.isNew && available && (
            <span className="rounded-full px-2 py-[3px] text-[.6rem] font-bold uppercase tracking-wide text-white" style={{ background: color }}>Top</span>
          )}
          {p.spicy && (
            <span className="glass-2 rounded-full px-2 py-[3px] text-[.6rem] font-semibold text-white/90">🌶 Picante</span>
          )}
          {!available && (
            <span className="rounded-full bg-black/70 px-2 py-[3px] text-[.6rem] font-bold uppercase tracking-wide text-white/70">Agotado</span>
          )}
        </div>

        {inCart > 0 && (
          <span className="absolute right-2.5 top-2.5 grid h-6 min-w-6 place-items-center rounded-full bg-[#30D158] px-1.5 text-[.7rem] font-bold text-white animate-scale-pop">
            {inCart}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {p.brand && <span className="text-[.62rem] font-semibold uppercase tracking-[.14em] text-white/40">{p.brand}</span>}
        <h3 className="mt-0.5 text-[.95rem] sm:text-base font-semibold leading-tight tracking-tight text-white">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-[.72rem] leading-snug text-white/45">{p.desc}</p>

        <div className="mt-auto flex items-center justify-between pt-3.5">
          <div className="leading-none">
            <span className="text-lg font-bold tracking-tight text-white">${p.price}</span>
            {p.tags[0] && <span className="ml-1.5 text-[.65rem] text-white/35">{p.tags[0]}</span>}
          </div>
          <button
            onClick={add}
            disabled={!available}
            aria-label={"Agregar " + p.name + " al carrito"}
            className={"add-btn " + (done ? "done" : "")}
          >
            {done ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export const ProductCard = memo(ProductCardBase)

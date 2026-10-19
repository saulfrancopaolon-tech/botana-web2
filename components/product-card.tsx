"use client"
import Image from "next/image"
import { memo, useState } from "react"
import { useCart } from "./cart-context"
import { CategoryIcon, CAT_COLOR, Ico } from "./icons"
import type { Product } from "@/lib/products"

interface Props {
  product: Product
  onAdd: (p: Product) => void
  /** Al tocar la tarjeta (no el botón Agregar) se abre el detalle */
  onOpen?: (p: Product) => void
}

function ProductCardBase({ product: p, onAdd, onOpen }: Props) {
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
      className={"pcard h-full " + (onOpen ? "cursor-pointer " : "") + (!available ? "opacity-50" : "")}
      onClick={onOpen ? () => onOpen(p) : undefined}
      onKeyDown={onOpen ? e => { if (e.key === "Enter" && e.target === e.currentTarget) onOpen(p) } : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? "Ver detalles de " + p.name : undefined}
    >
      {/* Imagen */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: "radial-gradient(120% 90% at 50% 12%, " + color + "40 0%, transparent 62%), #1b1b1e" }}
      >
        {/* Ícono de respaldo mientras no haya foto */}
        <div className="pimg absolute inset-0 grid place-items-center text-white/45">
          <CategoryIcon cat={p.cat} size={64} strokeWidth={1.3} />
        </div>
        {imgOk && (
          <Image
            src={p.img}
            alt={p.name}
            fill
            sizes="(max-width:640px) 46vw, (max-width:1024px) 31vw, 23vw"
            onError={() => setImgOk(false)}
            className={"pimg " + (p.fit === "contain" ? "object-contain p-5" : "object-cover")}
          />
        )}

        {/* Etiquetas */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {p.isNew && available && (
            <span className="rounded-full bg-white px-2 py-[3px] text-[.6rem] font-bold uppercase tracking-wide text-black">Nuevo</span>
          )}
          {p.spicy && (
            <span className="glass-2 flex items-center gap-1 rounded-full px-2 py-[3px] text-[.6rem] font-semibold text-white/90">
              <Ico name="flame" size={11} strokeWidth={2.4} style={{ color: "#FF6A3D" }} /> Picante
            </span>
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

      {/* Info — alturas fijas para que todas las tarjetas se alineen */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="h-3 text-[.62rem] font-semibold uppercase leading-3 tracking-[.14em] text-white/40">{p.brand ?? ""}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.35rem] text-[.92rem] font-semibold leading-[1.15rem] tracking-tight text-white sm:text-[.98rem]">{p.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[1.9rem] text-[.7rem] leading-[.95rem] text-white/45">{p.desc}</p>

        <div className="mt-auto flex items-center justify-between pt-3.5">
          <div className="min-w-0 leading-none">
            <span className="text-[1.05rem] font-bold tracking-tight text-white sm:text-lg">${p.price}</span>
            {p.tags[0] && <span className="ml-1.5 hidden text-[.65rem] text-white/35 sm:inline">{p.tags[0]}</span>}
          </div>
          <button
            onClick={add}
            disabled={!available}
            aria-label={"Agregar " + p.name + " al carrito"}
            className={"add-pill " + (done ? "done" : "")}
          >
            <Ico name={done ? "check" : "plus"} size={16} strokeWidth={3} />
            {done ? "Listo" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  )
}

export const ProductCard = memo(ProductCardBase)

"use client"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { useCart } from "./cart-context"
import { CategoryIcon, CAT_COLOR, Ico } from "./icons"
import type { Product } from "@/lib/products"

interface Props {
  product: Product | null
  /** Sabores del grupo (ej. Vualá); si hay más de uno se muestra el selector */
  variants?: Product[]
  onClose: () => void
  onAdded: (p: Product) => void
}

/**
 * Hoja de detalle del producto (estilo iOS): se desliza desde abajo en el teléfono
 * y aparece centrada en pantallas grandes. Se cierra con la X, tocando fuera,
 * con Escape o deslizando hacia abajo.
 */
export function ProductSheet({ product, variants, onClose, onAdded }: Props) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [closing, setClosing] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [sel, setSel] = useState<number | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const drag = useRef<{ y0: number; dy: number } | null>(null)

  // Reinicia el estado cada vez que se abre un producto distinto
  useEffect(() => {
    if (product) { setQty(1); setClosing(false); setImgOk(true); setSel(product.id) }
  }, [product])

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 260)
  }, [onClose])

  // Bloquea el scroll del fondo y cierra con Escape
  useEffect(() => {
    if (!product) return
    const d = document.documentElement
    const prev = d.style.overflow
    d.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", onKey)
    return () => { d.style.overflow = prev; window.removeEventListener("keydown", onKey) }
  }, [product, close])

  if (!product) return null
  const list = variants && variants.length > 1 ? variants : null
  const p = list ? (list.find(v => v.id === sel) ?? product) : product
  const color = CAT_COLOR[p.cat] ?? "#FF3B30"
  const available = p.inStock !== false

  // Deslizar hacia abajo para cerrar (solo desde la parte de arriba de la hoja)
  const onTouchStart = (e: React.TouchEvent) => { drag.current = { y0: e.touches[0].clientY, dy: 0 } }
  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current
    if (!d || !panel.current) return
    d.dy = Math.max(0, e.touches[0].clientY - d.y0)
    panel.current.style.transition = "none"
    panel.current.style.transform = "translateY(" + d.dy + "px)"
  }
  const onTouchEnd = () => {
    const d = drag.current
    drag.current = null
    if (!d || !panel.current) return
    if (d.dy > 110) { close(); return }
    panel.current.style.transition = "transform .35s var(--ease-apple)"
    panel.current.style.transform = ""
  }

  function add() {
    if (!available) return
    addItem(p, qty)
    onAdded(p)
    close()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={p.name}>
      <div className={"sheet-backdrop absolute inset-0 bg-black/65 backdrop-blur-sm " + (closing ? "is-out" : "")} onClick={close} />

      <div
        ref={panel}
        className={"sheet-panel relative w-full max-w-md overflow-hidden rounded-t-[32px] border border-white/10 bg-[#141416] shadow-[0_-20px_80px_-20px_rgba(0,0,0,.9)] sm:rounded-[32px] " + (closing ? "is-out" : "")}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
      >
        {/* Imagen + manija para deslizar */}
        <div
          className="relative aspect-[5/4] w-full touch-none"
          style={{ background: "radial-gradient(120% 90% at 50% 10%, " + color + "50 0%, transparent 65%), #1b1b1e" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <span className="absolute left-1/2 top-2.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/30 sm:hidden" />
          {!imgOk && <div className="absolute inset-0 grid place-items-center text-white/45"><CategoryIcon cat={p.cat} size={84} strokeWidth={1.2} /></div>}
          {imgOk && (
            <Image src={p.img} alt={p.name} fill sizes="448px" onError={() => setImgOk(false)} className={p.fit === "contain" ? "object-contain p-6" : "object-cover"} />
          )}
          <button onClick={close} aria-label="Cerrar" className="tap absolute right-3.5 top-3.5 z-10 grid h-9 w-9 place-items-center rounded-full glass-2 text-white">
            <Ico name="close" size={16} strokeWidth={2.6} />
          </button>
        </div>

        {/* Información */}
        <div className="px-5 pt-4">
          {p.brand && <div className="text-[.68rem] font-semibold uppercase tracking-[.16em] text-white/40">{p.brand}</div>}
          <h2 className="font-head mt-1 text-[1.9rem] text-white">{list ? (product.baseName ?? p.name) : p.name}</h2>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full px-2.5 py-1 text-[.68rem] font-semibold text-white" style={{ background: color + "CC" }}>{p.cat}</span>
            {p.spicy && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[.68rem] font-semibold text-white/85">
                <Ico name="flame" size={12} strokeWidth={2.4} style={{ color: "#FF6A3D" }} /> Picante
              </span>
            )}
            {p.tags.map(t => <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[.68rem] font-semibold text-white/70">{t}</span>)}
            {!available && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[.68rem] font-bold uppercase text-white/60">Agotado</span>}
          </div>

          {list && (
            <div className="mt-4">
              <div className="mb-2 text-[.68rem] font-semibold uppercase tracking-[.16em] text-white/40">Sabor</div>
              <div className="flex flex-wrap gap-2">
                {list.map(v => {
                  const ok = v.inStock !== false
                  const on = v.id === p.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => ok && setSel(v.id)}
                      disabled={!ok}
                      className={"tap rounded-full px-4 py-2 text-sm font-semibold transition-colors " + (on ? "bg-white text-black" : "bg-white/10 text-white/80") + (ok ? "" : " opacity-40 line-through")}
                    >
                      {v.flavor}{!ok ? " · Agotado" : ""}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <p className="mt-3 text-sm leading-relaxed text-white/55">{p.desc}</p>

          {/* Cantidad + agregar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-12 items-center rounded-full bg-white/[.08]">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Menos" className="tap grid h-12 w-11 place-items-center text-white disabled:opacity-30" disabled={qty <= 1}>
                <Ico name="minus" size={18} strokeWidth={2.6} />
              </button>
              <span className="w-7 text-center text-base font-bold tabular-nums text-white">{qty}</span>
              <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Más" className="tap grid h-12 w-11 place-items-center text-white">
                <Ico name="plus" size={18} strokeWidth={2.6} />
              </button>
            </div>
            <button onClick={add} disabled={!available} className="btn-primary h-12 flex-1 !px-4 disabled:opacity-40">
              Agregar · ${p.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

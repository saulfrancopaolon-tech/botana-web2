"use client"
import { useCallback, useEffect, useState } from "react"
import { useCart } from "./cart-context"
import { CAT_COLOR, Ico } from "./icons"
import type { Product } from "@/lib/products"

interface Props {
  /** Sabores del producto (ej. los tres Vualá). null = cerrado */
  variants: Product[] | null
  onClose: () => void
  onAdded: (p: Product) => void
}

/**
 * Menú de sabor: aparece al tocar "Agregar" en un producto con varios sabores.
 * Cada sabor tiene su propia cantidad y los agotados salen deshabilitados.
 */
export function FlavorPicker({ variants, onClose, onAdded }: Props) {
  const { addItem } = useCart()
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [closing, setClosing] = useState(false)

  useEffect(() => { if (variants) { setCounts({}); setClosing(false) } }, [variants])

  const close = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 260)
  }, [onClose])

  useEffect(() => {
    if (!variants) return
    const d = document.documentElement
    const prev = d.style.overflow
    d.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", onKey)
    return () => { d.style.overflow = prev; window.removeEventListener("keydown", onKey) }
  }, [variants, close])

  if (!variants) return null
  const rep = variants[0]
  const color = CAT_COLOR[rep.cat] ?? "#FF3B30"
  const total = variants.reduce((n, v) => n + (counts[v.id] ?? 0), 0)
  const money = variants.reduce((n, v) => n + (counts[v.id] ?? 0) * v.price, 0)
  const set = (id: number, n: number) => setCounts(c => ({ ...c, [id]: Math.max(0, Math.min(20, n)) }))

  function confirm() {
    if (!variants || total === 0) return
    variants.forEach(v => { const n = counts[v.id] ?? 0; if (n > 0) addItem(v, n) })
    onAdded({ ...rep, name: rep.baseName ?? rep.name })
    close()
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={"Elige el sabor de " + (rep.baseName ?? rep.name)}>
      <div className={"sheet-backdrop absolute inset-0 bg-black/65 backdrop-blur-sm " + (closing ? "is-out" : "")} onClick={close} />

      <div
        className={"sheet-panel relative w-full max-w-md overflow-hidden rounded-t-[32px] border border-white/10 bg-[#141416] px-5 pt-3 shadow-[0_-20px_80px_-20px_rgba(0,0,0,.9)] sm:rounded-[32px] sm:pt-6 " + (closing ? "is-out" : "")}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 18px)" }}
      >
        <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-white/25 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[.68rem] font-semibold uppercase tracking-[.16em] text-white/40">Elige tu sabor</div>
            <h2 className="font-head mt-1 text-[1.6rem] text-white">{rep.baseName ?? rep.name}</h2>
            <p className="mt-0.5 text-sm text-white/45">${rep.price} cada uno</p>
          </div>
          <button onClick={close} aria-label="Cerrar" className="tap grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-white/10 text-white">
            <Ico name="close" size={16} strokeWidth={2.6} />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {variants.map(v => {
            const ok = v.inStock !== false
            const n = counts[v.id] ?? 0
            return (
              <li
                key={v.id}
                className={"flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors " + (n > 0 ? "border-white/25 bg-white/[.09]" : "border-white/[.07] bg-white/[.04]") + (ok ? "" : " opacity-45")}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[.98rem] font-semibold text-white">
                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: ok ? color : "#666" }} />
                    {v.flavor}
                  </div>
                  <div className={"mt-0.5 text-xs " + (ok ? "text-[#30D158]" : "text-white/40")}>{ok ? "Disponible" : "Agotado"}</div>
                </div>

                <div className="flex h-10 items-center rounded-full bg-black/30">
                  <button onClick={() => set(v.id, n - 1)} disabled={!ok || n === 0} aria-label={"Quitar " + v.flavor} className="tap grid h-10 w-10 place-items-center text-white disabled:opacity-25">
                    <Ico name="minus" size={16} strokeWidth={2.8} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold tabular-nums text-white">{n}</span>
                  <button onClick={() => set(v.id, n + 1)} disabled={!ok} aria-label={"Agregar " + v.flavor} className="tap grid h-10 w-10 place-items-center text-white disabled:opacity-25">
                    <Ico name="plus" size={16} strokeWidth={2.8} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <button onClick={confirm} disabled={total === 0} className="btn-primary mt-5 h-12 w-full disabled:opacity-35">
          {total === 0 ? "Elige al menos un sabor" : "Agregar " + total + (total === 1 ? " pieza" : " piezas") + " · $" + money}
        </button>
      </div>
    </div>
  )
}

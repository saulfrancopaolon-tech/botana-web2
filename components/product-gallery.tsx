"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { Product } from "@/lib/products"
import { CategoryIcon, CAT_COLOR } from "./icons"

/** 10 recuadros en una cuadrícula de 4×4 (2 grandes + 8 chicos) — como una galería */
const SLOTS = [
  "col-span-2 row-span-2", "", "", "", "",
  "", "col-span-2 row-span-2", "", "", "",
]
const SWAP_MS = 2600

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Tile({ p, big, onPick }: { p: Product; big: boolean; onPick: (p: Product) => void }) {
  const [imgOk, setImgOk] = useState(true)
  const color = CAT_COLOR[p.cat] ?? "#FF3B30"
  return (
    <button
      onClick={() => onPick(p)}
      aria-label={"Ver " + p.name}
      className="tile-in group relative block h-full w-full overflow-hidden rounded-[18px] sm:rounded-[24px] text-left"
      style={{ background: "radial-gradient(110% 90% at 50% 15%, " + color + "55 0%, transparent 65%), #17171a", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}
    >
      {/* Ícono de respaldo (si aún no hay foto) */}
      <span className="absolute inset-0 grid place-items-center text-white/55">
        <CategoryIcon cat={p.cat} size={big ? 64 : 34} strokeWidth={1.4} />
      </span>
      {imgOk && (
        <Image
          src={p.img}
          alt=""
          fill
          sizes={big ? "(max-width:1024px) 50vw, 260px" : "(max-width:1024px) 25vw, 130px"}
          onError={() => setImgOk(false)}
          className={(p.fit === "contain" ? "object-contain p-2.5 sm:p-4" : "object-cover") + " transition-transform duration-700 [transition-timing-function:var(--ease-apple)] group-hover:scale-110"}
        />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2 pt-6 sm:px-3.5 sm:pb-3">
        <span className={"block truncate font-semibold leading-tight text-white " + (big ? "text-sm sm:text-base" : "text-[.62rem] sm:text-xs")}>{p.name}</span>
        {big && <span className="mt-0.5 block text-[.65rem] text-white/55">${p.price}</span>}
      </span>
    </button>
  )
}

export function ProductGallery({ products, onPick }: { products: Product[]; onPick: (p: Product) => void }) {
  const [slots, setSlots] = useState<Product[] | null>(null)
  const slotsRef = useRef<Product[] | null>(null)
  const queue = useRef<Product[]>([])
  const lastSlot = useRef(-1)
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  // Orden aleatorio distinto en cada visita (solo en el cliente)
  useEffect(() => {
    const sh = shuffle(products)
    const first = sh.slice(0, SLOTS.length)
    queue.current = sh.slice(SLOTS.length)
    slotsRef.current = first
    setSlots(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cambia un recuadro al azar cada cierto tiempo (solo si se ve en pantalla)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = wrap.current
    const io = el ? new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.1 }) : null
    if (el && io) io.observe(el)

    const id = setInterval(() => {
      const cur = slotsRef.current
      if (!cur || !visible.current || document.hidden || queue.current.length === 0) return
      let i = Math.floor(Math.random() * cur.length)
      if (i === lastSlot.current) i = (i + 3) % cur.length
      lastSlot.current = i
      const next = queue.current.shift()!
      queue.current.push(cur[i])
      const copy = [...cur]
      copy[i] = next
      slotsRef.current = copy
      setSlots(copy)
    }, SWAP_MS)
    return () => { clearInterval(id); io?.disconnect() }
  }, [])

  return (
    <div ref={wrap} className="mx-auto grid aspect-square w-full max-w-[520px] grid-cols-4 grid-rows-4 gap-2 sm:gap-3" aria-label="Galería de productos">
      {SLOTS.map((span, i) => (
        <div key={i} className={span + " min-h-0 min-w-0"}>
          {slots ? (
            <Tile key={slots[i].id} p={slots[i]} big={span !== ""} onPick={onPick} />
          ) : (
            <div className="shimmer h-full w-full rounded-[18px] sm:rounded-[24px] bg-white/[.05]" />
          )}
        </div>
      ))}
    </div>
  )
}

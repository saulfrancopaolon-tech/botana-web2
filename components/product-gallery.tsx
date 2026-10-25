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
const SWAP_MS = 3200   // cada cuánto cambia un recuadro
const FLIP_MS = 1000   // duración del giro

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Cara de un recuadro: foto (o ícono) + nombre */
function Face({ p, big, onPick }: { p: Product; big: boolean; onPick: (p: Product) => void }) {
  const [imgOk, setImgOk] = useState(true)
  const color = CAT_COLOR[p.cat] ?? "#FF3B30"
  return (
    <button
      onClick={() => onPick(p)}
      aria-label={"Ver " + p.name}
      className="group relative block h-full w-full overflow-hidden rounded-[18px] text-left sm:rounded-[24px]"
      style={{ background: "radial-gradient(110% 90% at 50% 15%, " + color + "55 0%, transparent 65%), #17171a", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}
    >
      {!imgOk && (
        <span className="absolute inset-0 grid place-items-center text-white/55">
          <CategoryIcon cat={p.cat} size={big ? 64 : 34} strokeWidth={1.4} />
        </span>
      )}
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
      {/* Brillo suave en la esquina */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[.10] via-transparent to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2 pt-6 sm:px-3.5 sm:pb-3">
        <span className={"block truncate font-semibold leading-tight text-white " + (big ? "text-sm sm:text-base" : "text-[.62rem] sm:text-xs")}>{p.baseName ?? p.name}</span>
        {big && <span className="mt-0.5 block text-[.65rem] text-white/55">${p.price}</span>}
      </span>
    </button>
  )
}

/**
 * Recuadro con giro 3D: cuando cambia el producto, la tarjeta se levanta,
 * gira hacia el otro lado (siempre en la misma dirección) y aterriza con el nuevo producto.
 */
function FlipSlot({ product, big, axis, delay, onPick }: {
  product: Product; big: boolean; axis: "X" | "Y"; delay: number; onPick: (p: Product) => void
}) {
  const [faces, setFaces] = useState<[Product, Product]>([product, product])
  const [turns, setTurns] = useState(0)
  const [lift, setLift] = useState(false)
  const shown = useRef(product)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (product.id === shown.current.id) return
    shown.current = product
    const hidden = 1 - (turns % 2)
    setFaces(f => (hidden === 0 ? [product, f[1]] : [f[0], product]))
    // Espera a que la cara oculta se pinte y luego gira
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLift(true)
        setTurns(t => t + 1)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setLift(false), FLIP_MS)
      })
    })
    return () => cancelAnimationFrame(r1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const visible = turns % 2
  const color = CAT_COLOR[product.cat] ?? "#FF3B30"

  return (
    <div className="tile-enter h-full w-full" style={{ animationDelay: delay + "ms" }}>
      <div className="flip-scene h-full w-full">
        <div
          className="flip-lift h-full w-full rounded-[18px] sm:rounded-[24px]"
          style={{
            transform: lift ? "translateY(-6px) scale(1.06)" : "none",
            boxShadow: lift ? "0 26px 50px -14px " + color + "99" : "0 0 0 transparent",
            zIndex: lift ? 5 : 0,
            position: "relative",
          }}
        >
          <div
            className="flip-inner"
            style={{ transform: "rotate" + axis + "(" + turns * 180 + "deg)", transitionDuration: FLIP_MS + "ms" }}
          >
            <div className="flip-face" style={{ pointerEvents: visible === 0 ? "auto" : "none" }}>
              <Face p={faces[0]} big={big} onPick={onPick} />
            </div>
            <div className="flip-face" style={{ transform: "rotate" + axis + "(180deg)", pointerEvents: visible === 1 ? "auto" : "none" }}>
              <Face p={faces[1]} big={big} onPick={onPick} />
            </div>
          </div>
        </div>
      </div>
    </div>
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

  // Cada cierto tiempo, un recuadro al azar gira y muestra otro producto
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = wrap.current
    const io = el ? new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.1 }) : null
    if (el && io) io.observe(el)

    let busy = false
    const id = setInterval(() => {
      const cur = slotsRef.current
      if (busy || !cur || !visible.current || document.hidden || queue.current.length === 0) return
      let i = Math.floor(Math.random() * cur.length)
      if (i === lastSlot.current) i = (i + 3) % cur.length
      const next = queue.current[0]
      busy = true

      const commit = () => {
        const now = slotsRef.current
        if (!now) { busy = false; return }
        lastSlot.current = i
        queue.current.shift()
        queue.current.push(now[i])
        const copy = [...now]
        copy[i] = next
        slotsRef.current = copy
        setSlots(copy)
        busy = false
      }

      // Precarga la foto para que no "salte" cuando llegue al giro
      const img = new window.Image()
      let done = false
      const go = () => { if (!done) { done = true; commit() } }
      img.onload = go
      img.onerror = go
      img.src = next.img
      setTimeout(go, 1200)
    }, SWAP_MS)

    return () => { clearInterval(id); io?.disconnect() }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Resplandor de colores girando detrás de la galería */}
      <div aria-hidden="true" className="gallery-glow" />
      <div ref={wrap} className="relative grid aspect-square w-full grid-cols-4 grid-rows-4 gap-2 sm:gap-3" aria-label="Galería de productos">
        {SLOTS.map((span, i) => (
          <div key={i} className={span + " min-h-0 min-w-0"}>
            {slots ? (
              <FlipSlot
                product={slots[i]}
                big={span !== ""}
                axis={i % 2 === 0 ? "Y" : "X"}
                delay={i * 80}
                onPick={onPick}
              />
            ) : (
              <div className="shimmer h-full w-full rounded-[18px] bg-white/[.05] sm:rounded-[24px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"
import { useEffect, useRef, useState } from "react"
import { CategoryIcon, CAT_COLOR, Ico } from "./icons"

interface Props {
  categories: string[]
  /** "" = ninguna activa (por ejemplo mientras se busca) */
  active: string
  onSelect: (cat: string) => void
  counts?: Record<string, number>
}

export function CategoryTabs({ categories, active, onSelect, counts }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const btns = useRef<Record<string, HTMLButtonElement | null>>({})
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null)

  // Mide la pestaña activa para mover la "píldora" que se desliza
  useEffect(() => {
    const measure = () => {
      const el = btns.current[active]
      if (!el) { setInd(null); return }
      setInd({ left: el.offsetLeft, width: el.offsetWidth })
      el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [active, categories])

  const color = CAT_COLOR[active]
  const bg = active === "Todos" || !color
    ? "linear-gradient(135deg,#FF9F0A,#FF3B30)"
    : "linear-gradient(135deg," + color + "," + color + "CC)"
  const glow = active === "Todos" || !color ? "rgba(255,59,48,.55)" : color + "88"

  return (
    <div ref={scroller} className="scrollbar-none overflow-x-auto" role="tablist" aria-label="Categorías">
      <div className="relative flex w-max gap-1 rounded-full bg-black/30 p-1">
        {/* Píldora deslizante */}
        <span
          aria-hidden="true"
          className="absolute bottom-1 top-1 rounded-full transition-[transform,width,background,box-shadow] duration-500 [transition-timing-function:var(--spring)]"
          style={{
            left: 0,
            width: ind?.width ?? 0,
            transform: "translateX(" + (ind?.left ?? 0) + "px)",
            opacity: ind ? 1 : 0,
            background: bg,
            boxShadow: "0 8px 22px -6px " + glow + ", inset 0 1px 0 rgba(255,255,255,.3)",
          }}
        />
        {categories.map(cat => {
          const on = cat === active
          return (
            <button
              key={cat}
              ref={el => { btns.current[cat] = el }}
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(cat)}
              className={"relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[.82rem] font-semibold tracking-tight transition-colors duration-300 " + (on ? "text-white" : "text-white/55 hover:text-white")}
            >
              {cat === "Todos" ? <Ico name="sparkles" size={16} /> : <CategoryIcon cat={cat} size={17} />}
              {cat}
              {counts?.[cat] != null && (
                <span className={"text-[.62rem] font-bold tabular-nums transition-opacity " + (on ? "opacity-80" : "opacity-35")}>{counts[cat]}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

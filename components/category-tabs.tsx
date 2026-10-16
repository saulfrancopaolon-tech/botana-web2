"use client"
import { useEffect, useRef } from "react"

const CAT_EMOJI: Record<string, string> = {
  Todos: "✨", Botanas: "🌶️", Cacahuates: "🥜", Chips: "🍠",
  Gomitas: "🐻", Papas: "🔥", Bebidas: "🥭", Dulces: "🍫",
}

interface Props {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
}

export function CategoryTabs({ categories, active, onSelect }: Props) {
  const wrap = useRef<HTMLDivElement>(null)

  // Centra automáticamente la categoría activa (como en apps nativas)
  useEffect(() => {
    const el = wrap.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })
  }, [active])

  return (
    <div ref={wrap} className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-6 py-3" role="tablist" aria-label="Categorías">
      {categories.map(cat => (
        <button
          key={cat}
          role="tab"
          aria-selected={cat === active}
          data-active={cat === active}
          onClick={() => onSelect(cat)}
          className="cat-chip"
        >
          <span className="text-[.95rem] leading-none">{CAT_EMOJI[cat] ?? "🌶️"}</span>
          {cat}
        </button>
      ))}
    </div>
  )
}

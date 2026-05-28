"use client"

const CAT_META: Record<string, { emoji: string; color: string }> = {
  "Todos":      { emoji: "🌶",  color: "#E53E3E" },
  "Cacahuates": { emoji: "🥜",  color: "#F97316" },
  "Chips":      { emoji: "🍠",  color: "#FBBF24" },
  "Gomitas":    { emoji: "🐻",  color: "#ec4899" },
  "Papas":      { emoji: "🔥",  color: "#E53E3E" },
  "Bebidas":    { emoji: "🥭",  color: "#22c55e" },
}

interface Props {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
}

export function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-6 py-3">
      {categories.map(cat => {
        const meta = CAT_META[cat] ?? { emoji: "🌶", color: "#E53E3E" }
        const isActive = cat === active
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[.72rem] font-black uppercase tracking-wider border transition-all " +
              (isActive
                ? "text-white border-transparent"
                : "border-white/10 text-white/45 hover:text-white hover:border-white/25 bg-transparent")
            }
            style={
              isActive
                ? { background: meta.color + "22", borderColor: meta.color + "55", color: "white" }
                : {}
            }
          >
            <span className="text-base leading-none">{meta.emoji}</span>
            {cat}
          </button>
        )
      })}
    </div>
  )
}

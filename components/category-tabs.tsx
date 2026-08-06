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
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-4 sm:px-6 py-2.5">
      {categories.map(cat => {
        const meta = CAT_META[cat] ?? { emoji: "🌶", color: "#E53E3E" }
        const isActive = cat === active
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[.72rem] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 " +
              (isActive
                ? "text-white scale-[1.03]"
                : "text-white/45 hover:text-white/75 bg-white/[.04]")
            }
            style={
              isActive
                ? {
                    background: meta.color,
                    boxShadow: "0 4px 16px " + meta.color + "55",
                  }
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

"use client"
interface Props { categories: string[]; active: string; onSelect: (cat: string) => void }
export function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-6 py-3 pb-3.5">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-[.76rem] font-bold tracking-[.06em] uppercase border transition-all whitespace-nowrap ${
            cat === active
              ? "bg-[#E53E3E] border-[#E53E3E] text-white"
              : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

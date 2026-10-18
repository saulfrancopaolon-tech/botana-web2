"use client"
import type { Product } from "@/lib/products"
import { ProductCard } from "./product-card"
import { AnimateIn } from "./animations"
import { CategoryIcon, CAT_COLOR, Ico } from "./icons"

interface GridProps {
  products: Product[]
  onAddToCart: (p: Product) => void
  /** true = vista "Todos" (una sección ordenada por categoría) · false = una sola cuadrícula */
  showGroups: boolean
}

const CAT_ORDER = ["Papas", "Cacahuates", "Chips", "Gomitas", "Bebidas", "Dulces"]

const CAT_SUB: Record<string, string> = {
  Papas: "Takis, Barcel, Runners y papas artesanales",
  Cacahuates: "Holandeses, con todo el sabor",
  Chips: "Vegetales crujientes",
  Gomitas: "Dulces, ácidas y enchiladas",
  Bebidas: "Coca-Cola, aguas y chamoyadas",
  Dulces: "Con sorpresa incluida",
}

// Dentro de cada sección: primero las marcas (Takis, Barcel…), luego lo demás
const BRAND_ORDER = ["Takis", "Barcel", "Coca-Cola", "Vualá"]
const rank = (p: Product) => {
  if (!p.brand) return 99
  const i = BRAND_ORDER.indexOf(p.brand)
  return i === -1 ? 50 : i
}
const tidy = (list: Product[]) => [...list].sort((a, b) => rank(a) - rank(b))

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"

export function ProductGrid({ products, onAddToCart, showGroups }: GridProps) {
  if (!products.length) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-white/[.06] text-white/50"><Ico name="search" size={28} /></div>
        <p className="text-base font-semibold text-white/70">No encontramos nada con eso</p>
        <p className="mt-1 text-sm text-white/35">Prueba con otra palabra o cambia de categoría.</p>
      </div>
    )
  }

  if (showGroups) {
    return (
      <div className="space-y-14 sm:space-y-16">
        {CAT_ORDER.map(cat => {
          const list = tidy(products.filter(p => p.cat === cat))
          if (!list.length) return null
          const color = CAT_COLOR[cat]
          return (
            <section key={cat} aria-labelledby={"sec-" + cat}>
              <AnimateIn>
                <header className="mb-5 flex items-center gap-3.5">
                  <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg," + color + "," + color + "99)", boxShadow: "0 10px 24px -8px " + color + "AA" }}>
                    <CategoryIcon cat={cat} size={26} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 id={"sec-" + cat} className="font-head text-[1.7rem] leading-none text-white sm:text-3xl">{cat}</h2>
                    <p className="mt-1 truncate text-xs text-white/40 sm:text-sm">{CAT_SUB[cat]}</p>
                  </div>
                  <span className="rounded-full bg-white/[.07] px-3 py-1 text-xs font-semibold tabular-nums text-white/50">{list.length}</span>
                </header>
              </AnimateIn>
              <div className={GRID}>
                {list.map((p, i) => (
                  <div key={p.id} className="rise" style={{ animationDelay: String(Math.min(i, 7) * 40) + "ms" }}>
                    <ProductCard product={p} onAdd={onAddToCart} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  return (
    <div className={GRID}>
      {tidy(products).map((p, i) => (
        <div key={p.id} className="rise" style={{ animationDelay: String(Math.min(i, 8) * 40) + "ms" }}>
          <ProductCard product={p} onAdd={onAddToCart} />
        </div>
      ))}
    </div>
  )
}

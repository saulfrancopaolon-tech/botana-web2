"use client"
import type { Product } from "@/lib/products"
import { ProductCard, CAT_COLOR } from "./product-card"
import { AnimateIn } from "./animations"

interface GridProps {
  products: Product[]
  onAddToCart: (p: Product) => void
  /** true = vista "Todos" (rails por categoría) · false = cuadrícula de una categoría */
  showGroups: boolean
  onProductClick?: (p: Product) => void
  /** Al tocar "Ver todo" en un rail */
  onSeeAll?: (cat: string) => void
}

const CAT_ORDER = ["Botanas", "Cacahuates", "Chips", "Gomitas", "Papas", "Bebidas", "Dulces"]

const CAT_SUB: Record<string, string> = {
  Botanas: "Takis, fuego y original",
  Cacahuates: "Holandeses, con todo el sabor",
  Chips: "Vegetales crujientes",
  Gomitas: "Dulces, ácidas y enchiladas",
  Papas: "Barcel, Runners y más",
  Bebidas: "Coca-Cola, aguas y chamoyadas",
  Dulces: "Con sorpresa incluida",
}

export function ProductGrid({ products, onAddToCart, showGroups, onSeeAll }: GridProps) {
  if (!products.length) {
    return (
      <div className="py-24 text-center">
        <div className="mb-3 text-5xl">🔍</div>
        <p className="text-base font-semibold text-white/70">No encontramos nada con eso</p>
        <p className="mt-1 text-sm text-white/35">Prueba con otra palabra o cambia de categoría.</p>
      </div>
    )
  }

  // ── Vista "Todos": un rail horizontal por categoría ──
  if (showGroups) {
    const popular = products.filter(p => p.pop && p.inStock !== false).slice(0, 10)
    return (
      <div className="space-y-10 sm:space-y-12">
        {popular.length > 0 && (
          <Rail title="🔥 Lo más pedido" sub="Lo que más se llevan en La Salle" color="#FF3B30">
            {popular.map((p, i) => (
              <ProductCard key={"pop-" + p.id} product={p} onAdd={onAddToCart} rail priority={i < 2} />
            ))}
          </Rail>
        )}

        {CAT_ORDER.map(cat => {
          const list = products.filter(p => p.cat === cat)
          if (!list.length) return null
          return (
            <Rail key={cat} title={cat} sub={CAT_SUB[cat]} color={CAT_COLOR[cat]} onSeeAll={onSeeAll ? () => onSeeAll(cat) : undefined}>
              {list.map(p => <ProductCard key={p.id} product={p} onAdd={onAddToCart} rail />)}
            </Rail>
          )
        })}
      </div>
    )
  }

  // ── Vista de una categoría / búsqueda: cuadrícula ──
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p, i) => (
        <div key={p.id} className="rise" style={{ animationDelay: String(Math.min(i, 8) * 45) + "ms" }}>
          <ProductCard product={p} onAdd={onAddToCart} />
        </div>
      ))}
    </div>
  )
}

function Rail({
  title, sub, color, onSeeAll, children,
}: { title: string; sub?: string; color?: string; onSeeAll?: () => void; children: React.ReactNode }) {
  return (
    <AnimateIn>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-head text-[1.7rem] sm:text-3xl text-white">{title}</h2>
          {sub && <p className="mt-1 text-xs sm:text-sm text-white/40">{sub}</p>}
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} className="flex-shrink-0 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: color ?? "#FF3B30" }}>
            Ver todo ›
          </button>
        )}
      </div>
      <div className="rail">{children}</div>
    </AnimateIn>
  )
}

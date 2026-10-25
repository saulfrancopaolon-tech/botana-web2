import type { Product } from "./products"

export interface CardItem {
  /** Producto que representa a la tarjeta (el primero disponible) */
  product: Product
  /** Todos los sabores del grupo (1 si no tiene variantes) */
  variants: Product[]
}

/** Junta en una sola tarjeta los productos que comparten variantGroup (ej. los sabores de Vualá). */
export function collapseVariants(list: Product[]): CardItem[] {
  const out: CardItem[] = []
  const idx = new Map<string, number>()
  for (const p of list) {
    if (!p.variantGroup) { out.push({ product: p, variants: [p] }); continue }
    const at = idx.get(p.variantGroup)
    if (at === undefined) { idx.set(p.variantGroup, out.length); out.push({ product: p, variants: [p] }) }
    else out[at].variants.push(p)
  }
  // la tarjeta muestra de portada el primer sabor disponible
  for (const it of out) if (it.variants.length > 1) it.product = it.variants.find(v => v.inStock !== false) ?? it.variants[0]
  return out
}

/** Todos los sabores de un producto (incluye al propio producto) */
export function variantsOf(p: Product, all: Product[]): Product[] {
  return p.variantGroup ? all.filter(x => x.variantGroup === p.variantGroup) : [p]
}

import { PRODUCTS } from "./products"

/* ═══════════════════════════════════════════════════════════════
   💰 PRECIOS DE B2B (mayoreo, distribuidor, eventos y paquetes)
   Los precios del MENÚ PRINCIPAL no se tocan (viven en lib/products.ts).
   Aquí solo se calculan los precios de negocio a partir de tus costos.
═══════════════════════════════════════════════════════════════ */

/** Tus costos reales por pieza, por ID de producto. Cámbialos aquí cuando cambien. */
export const COSTS: Record<number, number> = {
  1: 6.5, 2: 6.5, 3: 6.5,                                  // Cacahuates
  4: 12.33, 5: 11.7, 6: 11.7, 7: 11.7,                     // Chips vegetales
  8: 9.25, 9: 9.25, 10: 9.25, 11: 9.25,                    // Gomitas
  12: 11.5, 13: 11.5, 14: 11.5,                            // Papas
  15: 12, 17: 12,                                          // Aguas de medio litro
  16: 18.15, 18: 18.15, 19: 18.15,                         // Chamoyadas
  20: 23.56, 21: 23.56,                                    // Aguas de 1 litro
  22: 9.6, 23: 9.6, 24: 9.6, 25: 9.6, 26: 9.6, 27: 9.6,    // Chips Barcel, Takis y Runners
  28: 19, 32: 19, 33: 19,                                  // Vualá (todos los sabores)
  29: 11.7, 30: 6.5,                                       // Coca-Cola normal y Zero
  31: 16,                                                  // Chupa Chups Xtremes
  34: 9.6, 35: 9, 36: 6.9,                                 // Galletas: Príncipe, Oreo, Emperador (paquete de 6)
}

/** Margen mínimo sobre el precio de venta (0.28 = 28% de ganancia) */
export const MARGIN = {
  evento: 0.35,           // precio base de evento
  mayoreo: 0.28,          // 30+ piezas
  distribuidor: 0.18,     // 100+ piezas
  pisoConDescuento: 0.15, // margen mínimo aun con el descuento máximo por volumen del cotizador
  paquete: 0.28,          // paquetes de evento
}
export const MAX_VOLUME_DISCOUNT = 0.15

const up = (n: number) => Math.ceil(n - 1e-9)
/** Precio mínimo (en pesos enteros) que deja el margen pedido */
export const minPrice = (cost: number, margin: number) => up(cost / (1 - margin))

export const retailOf = (id: number, fallback = 0) => PRODUCTS.find(p => p.id === id)?.price ?? fallback
export const costOf = (id: number, fallback = 0) => COSTS[id] ?? fallback

/** Precio de evento: nunca por debajo del margen mínimo ni por encima del precio del menú. */
export function eventPricing(base: number, retail: number, cost: number) {
  // Aún sin costo registrado: precio del menú y sin descuento por volumen, para no arriesgar perder
  if (!cost) return { event: retail, noDisc: true }
  const event = Math.min(retail, Math.max(base, minPrice(cost, MARGIN.evento)))
  const worst = event * (1 - MAX_VOLUME_DISCOUNT)
  // si con el descuento máximo ya no deja margen, ese producto no entra al descuento por volumen
  const noDisc = (worst - cost) / worst < MARGIN.pisoConDescuento
  return { event, noDisc }
}

/** Precio de mayoreo y distribuidor con margen mínimo; nunca más caro que el menú. */
export function tierPricing(baseMay: number, baseDist: number, retail: number, cost: number) {
  const may = Math.min(retail, Math.max(baseMay, minPrice(cost, MARGIN.mayoreo)))
  const dist = Math.min(may, Math.max(baseDist, minPrice(cost, MARGIN.distribuidor)))
  return { may, dist, noVolume: may >= retail }
}

export interface WholesaleRow { name: string; cat: string; ids: number[]; retail: number; may: number; dist: number; cost: number }

// "base" = precios que ya usabas; solo suben si no alcanzan el margen mínimo.
const GROUPS: { name: string; cat: string; ids: number[]; may?: number; dist?: number }[] = [
  { name: "Cacahuates",                    cat: "Cacahuates", ids: [1, 2, 3],                   may: 12, dist: 10 },
  { name: "Chips vegetales",               cat: "Chips",      ids: [4, 5, 6, 7],                may: 20, dist: 17 },
  { name: "Gomitas",                       cat: "Gomitas",    ids: [8, 9, 10, 11],              may: 12, dist: 11 },
  { name: "Papas",                         cat: "Papas",      ids: [12, 13, 14],                may: 16, dist: 15 },
  { name: "Takis, Chips Barcel y Runners", cat: "Papas",      ids: [22, 23, 24, 25, 26, 27] },
  { name: "Aguas de ½ litro",              cat: "Bebidas",    ids: [15, 17],                    may: 18, dist: 17 },
  { name: "Chamoyadas",                    cat: "Bebidas",    ids: [16, 18, 19],                may: 25, dist: 23 },
  { name: "Coca-Cola Zero 355 ml",         cat: "Bebidas",    ids: [30] },
  { name: "Galletas Oreo y Príncipe (6 pzas)", cat: "Dulces", ids: [34, 35] },
  { name: "Galletas Emperador (6 pzas)",   cat: "Dulces",     ids: [36] },
]

export const WHOLESALE_ROWS: WholesaleRow[] = GROUPS.map(g => {
  const retail = Math.max(...g.ids.map(id => retailOf(id)))
  const cost = Math.max(...g.ids.map(id => costOf(id)))       // el más caro del grupo, para no perder
  const baseMay = g.may ?? Math.round(retail * 0.8)
  const baseDist = g.dist ?? Math.round(retail * 0.72)
  const { may, dist } = tierPricing(baseMay, baseDist, retail, cost)
  return { name: g.name, cat: g.cat, ids: g.ids, retail, may, dist, cost }
})

/** Productos que, con tus costos, no dejan margen para dar descuento por volumen */
export const NO_VOLUME_NAMES: string[] = [28, 29, 31]
  .filter(id => tierPricing(0, 0, retailOf(id), costOf(id)).noVolume)
  .map(id => { const p = PRODUCTS.find(x => x.id === id)!; return p.baseName ?? p.name })

/** Costo promedio por pieza de un mix (partes que suman 1) */
const avg = (ids: number[]) => ids.reduce((s, id) => s + costOf(id), 0) / ids.length
const COST_CACAHUATE = avg([1, 2, 3])
const COST_GOMITA = avg([8, 9, 10, 11])
const COST_PAPAS = avg([12, 13, 14, 22, 25])        // papas y botanas saladas
const COST_CHIPS = avg([4, 5, 6, 7])

/** Precio de paquete: costo del mix + margen, redondeado hacia arriba a decenas */
const pkg = (pieces: number, costPerPiece: number) => Math.ceil((pieces * costPerPiece) / (1 - MARGIN.paquete) / 10) * 10
/** Paquete Fácil: 50 piezas, mitad cacahuates y mitad gomitas */
export const PRICE_FACIL = pkg(50, (COST_CACAHUATE + COST_GOMITA) / 2)
/** Paquete Fiesta: 100 piezas, mix completo (35% cacahuates, 25% gomitas, 25% papas/botanas, 15% chips) */
export const PRICE_FIESTA = pkg(100, 0.35 * COST_CACAHUATE + 0.25 * COST_GOMITA + 0.25 * COST_PAPAS + 0.15 * COST_CHIPS)

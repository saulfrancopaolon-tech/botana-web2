export const CATEGORIES = ["Todos", "Botanas", "Cacahuates", "Chips", "Gomitas", "Papas", "Bebidas", "Dulces"]

export interface ProductBase {
  id: number
  name: string
  desc: string
  price: number
  cat: string
  tags: string[]
  pop: boolean
  spicy: boolean
  natural: boolean
  emoji: string
  img: string
  groupId: string
  flavor: string
  /** "contain" para fotos de empaque con fondo transparente, "cover" para fotos llenas */
  fit?: "cover" | "contain"
  /** Marca (solo para productos de marca) */
  brand?: string
  /** Muestra la etiqueta "Nuevo" */
  isNew?: boolean
}

export const PRODUCTS: ProductBase[] = [
  { id: 1,  name: "Cacahuate Habanero",     desc: "Cacahuates holandeses con el intenso sabor del chile habanero. Crujientes y picosos.", price: 15, cat: "Cacahuates", tags: ["100g"],            pop: true,  spicy: true,  natural: false, emoji: "🥜", img: "/images/4.webp",  groupId: "cacahuates",  flavor: "Habanero"    },
  { id: 2,  name: "Cacahuate Jalapeño",     desc: "Cacahuates holandeses con el sabor clasico del jalapeño. El balance perfecto.",        price: 15, cat: "Cacahuates", tags: ["100g"],            pop: false, spicy: true,  natural: false, emoji: "🥜", img: "/images/3.webp",  groupId: "cacahuates",  flavor: "Jalapeño"    },
  { id: 3,  name: "Cacahuate Fuego",        desc: "Cacahuates holandeses sazonados al estilo fuego. Tradicionales y llenos de sabor.",    price: 15, cat: "Cacahuates", tags: ["100g"],            pop: false, spicy: true,  natural: false, emoji: "🥜", img: "/images/2.webp",  groupId: "cacahuates",  flavor: "Fuego"       },
  { id: 4,  name: "Chips de Betabel",       desc: "Chips crujientes de betabel natural. Snack saludable con sabor unico y color intenso.", price: 25, cat: "Chips",     tags: ["60g", "Natural"], pop: true,  spicy: false, natural: false, emoji: "🫚", img: "/images/6.webp",  groupId: "chips",       flavor: "Betabel"     },
  { id: 5,  name: "Chips de Jicama",        desc: "Chips de jicama ligeras y crujientes. El snack perfecto bajo en calorias.",            price: 25, cat: "Chips",     tags: ["60g", "Natural"], pop: false, spicy: false, natural: false, emoji: "🥗", img: "/images/8.webp",  groupId: "chips",       flavor: "Jicama"      },
  { id: 6,  name: "Chips de Taro",          desc: "Chips exoticas de taro con sabor suave y textura unica. Diferente y delicioso.",       price: 25, cat: "Chips",     tags: ["60g", "Gourmet"], pop: false, spicy: false, natural: false, emoji: "🫙", img: "/images/7.webp",  groupId: "chips",       flavor: "Taro"        },
  { id: 7,  name: "Chips de Camote",        desc: "Laminas de camote natural deshidratadas. Un snack dulce-salado super crujiente.",      price: 25, cat: "Chips",     tags: ["60g", "Natural"], pop: true,  spicy: false, natural: false, emoji: "🍠", img: "/images/19.webp", groupId: "chips",       flavor: "Camote"      },
  { id: 8,  name: "Gomitas de Durazno",     desc: "Aros de gomita con sabor a durazno. Dulces, suaves y deliciosas.",                    price: 15, cat: "Gomitas",   tags: ["100g"],            pop: false, spicy: false, natural: false, emoji: "🍑", img: "/images/9.webp",  groupId: "gomitas",     flavor: "Durazno"     },
  { id: 9,  name: "Gomitas Gusano",         desc: "Gusanos de gomita enchilados sabor pepino. El snack acido-picoso que todos quieren.", price: 15, cat: "Gomitas",   tags: ["100g"],            pop: true,  spicy: true,  natural: false, emoji: "🪱", img: "/images/12.webp", groupId: "gomitas",     flavor: "Gusano"      },
  { id: 10, name: "Gomitas Pic-Ositos",     desc: "Ositos de gomita enchilados con chile. Un clasico mexicano irresistible.",             price: 15, cat: "Gomitas",   tags: ["100g"],            pop: true,  spicy: true,  natural: false, emoji: "🐻", img: "/images/11.webp", groupId: "gomitas",     flavor: "Pic-Ositos"  },
  { id: 11, name: "Gomitas de Tiburon",     desc: "Gomitas en forma de tiburon con sabor frutal. Divertidas y deliciosas.",              price: 15, cat: "Gomitas",   tags: ["100g"],            pop: false, spicy: false, natural: false, emoji: "🦈", img: "/images/18.webp", groupId: "gomitas",     flavor: "Tiburon"     },
  { id: 12, name: "Papas Naturales",        desc: "Papas fritas artesanales con sal natural. El clasico sabor crujiente de siempre.",    price: 20, cat: "Papas",     tags: ["60g"],             pop: false, spicy: false, natural: false, emoji: "🥔", img: "/images/13.webp", groupId: "papas",       flavor: "Natural"     },
  { id: 13, name: "Papas Adobadas",         desc: "Papas sazonadas con adobo mexicano tradicional. Sabor intenso e irresistible.",       price: 20, cat: "Papas",     tags: ["60g"],             pop: true,  spicy: true,  natural: false, emoji: "🌶️", img: "/images/14.webp", groupId: "papas",       flavor: "Adobada"     },
  { id: 14, name: "Papas Fuego",            desc: "Papas con el maximo nivel de picante. Solo para los mas valientes. Te atreves?",     price: 20, cat: "Papas",     tags: ["60g"],             pop: true,  spicy: true,  natural: false, emoji: "🔥", img: "/images/15.webp", groupId: "papas",       flavor: "Fuego"       },
  { id: 15, name: "Agua de Jamaica",        desc: "Refrescante agua de jamaica natural infusionada en frio. Sin conservadores.",         price: 22, cat: "Bebidas",   tags: ["500ml", "Natural"], pop: false, spicy: false, natural: true,  emoji: "🌺", img: "/images/70.webp", groupId: "aguas",       flavor: "Jamaica"     },
  { id: 20, name: "Agua de Jamaica Grande",  desc: "Agua de jamaica natural de 1 litro. Sin conservadores. Rinde para toda la mesa o el dia.",    price: 35, cat: "Bebidas", tags: ["1 Litro","Natural"], pop: true, spicy: false, natural: true, emoji: "🌺", img: "/images/74.webp", groupId: "aguas", flavor: "Jamaica 1L"       },
  { id: 17, name: "Agua de Horchata",       desc: "Cremosa agua de horchata con canela. Dulce, fresca y reconfortante.",                price: 22, cat: "Bebidas",   tags: ["500ml", "Natural"], pop: false, spicy: false, natural: true,  emoji: "🥛", img: "/images/71.webp", groupId: "aguas",       flavor: "Horchata"    },
  { id: 21, name: "Agua de Horchata Grande", desc: "Horchata cremosa con canela en presentacion de 1 litro. Para compartir o durar todo el dia.", price: 35, cat: "Bebidas", tags: ["1 Litro","Natural"], pop: true, spicy: false, natural: true, emoji: "🥛", img: "/images/75.webp", groupId: "aguas", flavor: "Horchata 1L"      },
  { id: 16, name: "Chamoyada de Mango",     desc: "Deliciosa combinacion de mango con chamoy. La bebida del verano todo el ano.",       price: 30, cat: "Bebidas",   tags: ["Fresco", "Frutal"], pop: true,  spicy: true,  natural: false, emoji: "🥭", img: "/images/69.webp", groupId: "chamoyadas",  flavor: "Mango"       },
  { id: 18, name: "Chamoyada de Fresa",     desc: "Fresa natural con chamoy y chile. Dulce, acida y picante en cada sorbo.",           price: 30, cat: "Bebidas",   tags: ["Fresco", "Frutal"], pop: true,  spicy: true,  natural: false, emoji: "🍓", img: "/images/72.webp", groupId: "chamoyadas",  flavor: "Fresa"       },
  { id: 19, name: "Chamoyada de Limon",     desc: "Limon fresco con chamoy y chilito. El clasico sabor mexicano bien frio.",           price: 30, cat: "Bebidas",   tags: ["Fresco", "Picante"], pop: false, spicy: true,  natural: false, emoji: "🍋", img: "/images/73.webp", groupId: "chamoyadas",  flavor: "Limon"       },

  // ═══════════ NUEVOS — BOTANAS DE MARCA ═══════════
  // ⚠️ Los precios son de ejemplo: cámbialos por los tuyos.
  // 📷 Imagen: sube el archivo a /public/images/ con EXACTAMENTE el nombre de "img".
  { id: 22, name: "Chips Barcel Jalapeño", desc: "Las clásicas Chips de Barcel con el sabor del jalapeño. Crujientes y con el picante justo.", price: 20, cat: "Botanas", tags: ["Barcel"], pop: true,  spicy: true,  natural: false, emoji: "🥔", img: "/images/chips-jalapeno.webp", groupId: "chips-barcel", flavor: "Jalapeño", fit: "contain", brand: "Barcel", isNew: true },
  { id: 23, name: "Chips Barcel Naturales", desc: "Las Chips de Barcel de siempre, con sal. Simples, crujientes, imposibles de dejar.",       price: 20, cat: "Botanas", tags: ["Barcel"], pop: false, spicy: false, natural: false, emoji: "🥔", img: "/images/chips-naturales.webp", groupId: "chips-barcel", flavor: "Naturales", fit: "contain", brand: "Barcel", isNew: true },
  { id: 24, name: "Chips Barcel Fuego",     desc: "Chips de Barcel con el picante intenso de Fuego. Para los que no se rajan.",               price: 20, cat: "Botanas", tags: ["Barcel"], pop: true,  spicy: true,  natural: false, emoji: "🔥", img: "/images/chips-fuego.webp",     groupId: "chips-barcel", flavor: "Fuego",     fit: "contain", brand: "Barcel", isNew: true },
  { id: 25, name: "Takis Fuego",            desc: "Los enrollados más famosos con el picante más intenso. Crujen, pican y enamoran.",         price: 22, cat: "Botanas", tags: ["Takis"],  pop: true,  spicy: true,  natural: false, emoji: "🌶️", img: "/images/takis-fuego.webp",    groupId: "takis",        flavor: "Fuego",     fit: "contain", brand: "Takis",  isNew: true },
  { id: 26, name: "Takis Original",         desc: "El clásico Takis enrollado y extra crujiente. El sabor original que todos conocen.",       price: 22, cat: "Botanas", tags: ["Takis"],  pop: true,  spicy: false, natural: false, emoji: "🌽", img: "/images/takis-original.webp", groupId: "takis",        flavor: "Original",  fit: "contain", brand: "Takis",  isNew: true },
  { id: 27, name: "Runners",                desc: "Botana crujiente de Barcel para compartir (o no). Ideal para cualquier momento.",         price: 15, cat: "Botanas", tags: ["Barcel"], pop: false, spicy: false, natural: false, emoji: "🍿", img: "/images/runners.webp",         groupId: "runners",      flavor: "Runners",   fit: "contain", brand: "Barcel", isNew: true },
  { id: 28, name: "Vualá Sorpresa de Chocolate", desc: "Chocolate con sorpresa adentro. Lo abres, lo disfrutas y descubres qué te tocó.",  price: 20, cat: "Dulces",  tags: ["Chocolate", "Sorpresa"], pop: true, spicy: false, natural: false, emoji: "🍫", img: "/images/vuala.webp", groupId: "vuala", flavor: "Sorpresa", fit: "contain", brand: "Vualá", isNew: true },

]

export type Product = ProductBase & { inStock?: boolean }

export interface ProductGroup {
  groupId: string
  cat: string
  products: Product[]
  pop: boolean
}

export function buildGroups(products: Product[]): (Product | ProductGroup)[] {
  const seen = new Set<string>()
  const grouped: Record<string, Product[]> = {}

  products.forEach(p => {
    if (p.groupId) {
      if (!grouped[p.groupId]) grouped[p.groupId] = []
      grouped[p.groupId].push(p)
    }
  })

  const result: (Product | ProductGroup)[] = []

  products.forEach(p => {
    if (!p.groupId) { result.push(p); return }
    if (seen.has(p.groupId)) return
    seen.add(p.groupId)
    const grp = grouped[p.groupId]
    if (grp.length === 1) {
      result.push(grp[0])
    } else {
      result.push({ groupId: p.groupId, cat: p.cat, products: grp, pop: grp.some(x => x.pop) })
    }
  })

  return result
}

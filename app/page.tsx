"use client"

import { AboutSection } from "@/components/about-section"
import { useState, useEffect } from "react"
import { MenuHeader } from "@/components/menu-header"
import { CategoryTabs } from "@/components/category-tabs"
import { MenuItem } from "@/components/menu-item"
import { ProductModal } from "@/components/product-modal"

const categories = ["🔥 TOP", "Todos", "Cacahuates", "Chips", "Papas", "Gomitas", "Bebidas y más"]

const menuItems = [
  // ... tus items se quedan igual
  { id: 1, name: "Cacahuates Queso", description: "Cacahuates holandeses crujientes con un irresistible sabor a queso.", price: "$15", image: "/images/2.webp", category: "Cacahuates", tags: ["100 gramos"], isPopular: false, isSpicy: false },
  { id: 2, name: "Cacahuates Habanero", description: "Cacahuates holandeses con el intenso sabor del chile habanero.", price: "$15", image: "/images/4.webp", category: "Cacahuates", tags: ["100 gramos"], isPopular: false, isSpicy: true },
  { id: 3, name: "Cacahuates Jalapeño", description: "Cacahuates holandeses con el sabor clasico del chile jalapeño.", price: "$15", image: "/images/3.webp", category: "Cacahuates", tags: ["100 gramos"], isPopular: false, isSpicy: true },
  { id: 4, name: "Cacahuates Fuego", description: "Cacahuates holandeses con sabor intenso y picante estilo fuego.", price: "$15", image: "/images/5.webp", category: "Cacahuates", tags: ["100 gramos"], isPopular: false, isSpicy: true },
  { id: 5, name: "Chips Betabel con Chile", description: "Chips crujientes de betabel natural. Snack saludable con un sabor unico.", price: "$25", image: "/images/6.webp", category: "Chips", tags: ["60 gramos", "Natural"], isPopular: true, isSpicy: false },
  { id: 6, name: "Chips Jicama con Chile", description: "Chips de jicama ligeras y crujientes. El snack perfecto bajo en calorias.", price: "$25", image: "/images/8.webp", category: "Chips", tags: ["60 gramos", "Natural"], isPopular: false, isSpicy: false },
  { id: 7, name: "Chips Taro", description: "Chips exoticas de taro con un sabor suave y textura unica.", price: "$25", image: "/images/7.webp", category: "Chips", tags: ["60 gramos", "Natural"], isPopular: false, isSpicy: false },
  { id: 15, name: "Chips Taro Adobado", description: "Crujientes chips de taro con un sazón de adobo artesanal.", price: "$25", image: "/images/10.webp", category: "Chips", tags: ["60 gramos", "Gourmet"], isPopular: false, isSpicy: true },
  { id: 16, name: "Chips Camote", description: "Láminas de camote natural deshidratadas. Un snack dulce-salado súper crujiente.", price: "$25", image: "/images/19.webp", category: "Chips", tags: ["60 gramos", "Natural"], isPopular: true, isSpicy: false },
  { id: 8, name: "Papas Naturales", description: "Papas fritas artesanales con sal natural. El clasico sabor crujiente.", price: "$20", image: "/images/13.webp", category: "Papas", tags: ["60 gramos"], isPopular: false, isSpicy: false },
  { id: 9, name: "Papas Adobadas", description: "Papas sazonadas con adobo mexicano tradicional. Sabor intenso.", price: "$20", image: "/images/14.webp", category: "Papas", tags: ["60 gramos"], isPopular: true, isSpicy: true },
  { id: 10, name: "Papas Fuego", description: "Papas con el maximo nivel de picante. Solo para los mas valientes.", price: "$20", image: "/images/15.webp", category: "Papas", tags: ["60 gramos"], isPopular: true, isSpicy: true },
  { id: 11, name: "Gomitas Durazno", description: "Aros de gomita con sabor a durazno. Dulces, suaves y deliciosas.", price: "$15", image: "/images/9.webp", category: "Gomitas", tags: ["100 gramos"], isPopular: false, isSpicy: false },
  { id: 12, name: "Gomitas Tiburon", description: "Gomitas en forma de tiburon con sabor frutal. Divertidas.", price: "$15", image: "/images/18.webp", category: "Gomitas", tags: ["100 gramos"], isPopular: false, isSpicy: false },
  { id: 13, name: "Gomitas Pic-Osito", description: "Ositos de gomita suaves por dentro enchilados con chile.", price: "$15", image: "/images/11.webp", category: "Gomitas", tags: ["100 gramos"], isPopular: true, isSpicy: true },
  { id: 14, name: "Gomitas Gusano Diablo", description: "Gusanos de gomita enchilados sabor pepino. El snack picoso.", price: "$15", image: "/images/12.webp", category: "Gomitas", tags: ["100 gramos"], isPopular: true, isSpicy: true },
  { id: 17, name: "Mangonada", description: "Deliciosa combinación de mango natural y chamoy.", price: "$30", image: "/images/69.webp", category: "Bebidas y más", tags: ["Fresco", "Frutal"], isPopular: true, isSpicy: true },
  { id: 18, name: "Agua de Jamaica", description: "Refrescante agua de jamaica natural infusionada en frío.", price: "$22", image: "/images/70.webp", category: "Bebidas y más", tags: ["500ml", "Natural"], isPopular: false, isSpicy: false },
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("🔥 TOP")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stockData, setStockData] = useState<Record<number, boolean>>({})

  // --- LÓGICA DE SWIPE MEJORADA (Anti-clicks fantasmas en iPhone) ---
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null)
  const minSwipeDistance = 70 // Subimos un poco el umbral para mayor seguridad

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    
    // VERIFICACIÓN CLAVE: ¿Es un movimiento horizontal? 
    // Si el movimiento vertical es mayor al horizontal, ignoramos el swipe.
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const isEnoughDistance = Math.abs(distanceX) > minSwipeDistance

    if (isHorizontalSwipe && isEnoughDistance) {
      const currentIndex = categories.indexOf(activeCategory)
      if (distanceX > 0 && currentIndex < categories.length - 1) {
        // Swipe a la izquierda (Siguiente)
        setActiveCategory(categories[currentIndex + 1])
      } else if (distanceX < 0 && currentIndex > 0) {
        // Swipe a la derecha (Anterior)
        setActiveCategory(categories[currentIndex - 1])
      }
    }
  }

  // --- RESTO DEL CÓDIGO (Stock y Filtrado) ---
  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSQKeuTywAmniswIKciTQS0hI-fMIm4l0DRiGATcUpA_eff42eVS6171CngdgtGphWUADrllm5dcxe1/pub?output=csv")
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1)
        const currentStock: Record<number, boolean> = {}
        rows.forEach((row) => {
          const columns = row.split(",")
          if (columns.length >= 3) {
            const id = columns[0].trim()
            const disponible = columns[2].trim()
            currentStock[Number(id)] = disponible.toUpperCase() === "SI"
          }
        })
        setStockData(currentStock)
      })
  }, [])

  const itemsWithStock = menuItems.map((item) => ({
    ...item,
    inStock: stockData[item.id] !== undefined ? stockData[item.id] : true,
  }))

  const filteredItems = 
    activeCategory === "🔥 TOP" 
    ? itemsWithStock.filter(item => item.isPopular) 
    : activeCategory === "Todos"
    ? itemsWithStock
    : itemsWithStock.filter((item) => item.category === activeCategory)

  const handleProductClick = (item: any) => {
    setSelectedProduct(item)
    setIsModalOpen(true)
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <MenuHeader categories={categories} onCategoryChange={setActiveCategory} />

        <section className="pb-4 sm:pb-8 sticky top-[80px] z-20 bg-zinc-950/80 backdrop-blur-md pt-2">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        <section
          className="pb-16 min-h-[70vh]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            key={activeCategory}
            className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          >
            {filteredItems.map((item) => (
              <MenuItem
                key={item.id}
                {...item}
                onClick={() => handleProductClick(item)}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center opacity-50">
              <p>Próximamente más sorpresas...</p>
            </div>
          )}
        </section>

        <footer className="border-t border-white/10 py-12 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest">BOTA-NA by Saul & Aranza</p>
        </footer>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
      <AboutSection />
    </main>
  )
}

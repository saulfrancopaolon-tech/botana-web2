"use client"

import { motion } from "framer-motion"
import { LayoutGrid, Zap, Disc, Cookie, Candy } from "lucide-react"

const navItems = [
  { id: "Todos", icon: LayoutGrid },
  { id: "Cacahuates", icon: Zap },
  { id: "Chips", icon: Disc },
  { id: "Papas", icon: Cookie },
  { id: "Gomitas", icon: Candy },
]

interface BottomNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function BottomNav({ activeCategory, onCategoryChange }: BottomNavProps) {
  const activeIndex = navItems.findIndex(item => item.id === activeCategory)
  
  // SOLUCIÓN: Extraemos el icono a una variable que empiece con Mayúscula
  const ActiveIcon = navItems[activeIndex >= 0 ? activeIndex : 0].icon

  return (
    <nav className="fixed bottom-6 left-1/2 z-[90] w-[95%] max-w-md -translate-x-1/2 sm:hidden">
      <div className="relative flex h-16 items-center justify-around rounded-[2.5rem] bg-zinc-900/90 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        
        {/* El Círculo Flotante */}
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-[0_10px_20px_rgba(249,115,22,0.4)] border-[6px] border-zinc-950"
          animate={{ x: `${(activeIndex - 2) * 100}%` }} 
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <div className="text-white">
            {/* Ahora usamos la variable ActiveIcon directamente */}
            <ActiveIcon className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Botones */}
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeCategory === item.id

          return (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className="relative flex h-full w-full flex-col items-center justify-center"
            >
              <div className={`transition-all duration-300 ${isActive ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
                <Icon className="h-5 w-5 text-zinc-600" />
              </div>
              
              <span className={`absolute bottom-2 text-[7px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? "opacity-100 text-orange-500" : "opacity-0"}`}>
                {item.id}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

"use client"

import { motion } from "framer-motion"
import { useRef, useEffect } from "react"

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: any) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeElement = document.getElementById(`tab-${activeCategory}`)
    if (activeElement && scrollRef.current) {
      const scrollContainer = scrollRef.current
      const scrollLeft = activeElement.offsetLeft - scrollContainer.offsetWidth / 2 + activeElement.offsetWidth / 2
      scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeCategory])

  return (
    <div className="relative w-full px-4 overflow-hidden h-[50px]">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar items-center pb-8 -mb-8 pt-2"
      >
        <div className="flex bg-zinc-900/40 p-1.5 rounded-full border border-white/5 backdrop-blur-md shrink-0">
          {categories.map((category: string) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                id={`tab-${category}`}
                /* 1. AGREGAMOS type="button" para que no haga submit */
                type="button" 
                onClick={(e) => {
                  /* 2. EVITAMOS cualquier comportamiento por defecto */
                  e.preventDefault(); 
                  onCategoryChange(category);
                }}
                className={`relative flex-shrink-0 px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive ? "text-white" : "text-zinc-500"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 rounded-full bg-[oklch(0.55_0.15_45)] shadow-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

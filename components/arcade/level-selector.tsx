"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const levels = [
  { id: 1, name: "Cacahuate", reward: "1.5 Puntos", difficulty: "Fácil", img: "/images/2.webp" },
  { id: 2, name: "Chips", reward: "15% OFF", difficulty: "Medio", img: "/images/6.webp" },
  { id: 3, name: "Papas Fuego", reward: "GRATIS", difficulty: "EXTREMO", img: "/images/15.webp" },
]

export function LevelSelector({ onSelect }: { onSelect: (id: number) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 p-2">
      <p className="text-[9px] font-black text-zinc-500 uppercase text-center tracking-[0.3em] mb-4 italic">Selecciona tu desafío</p>
      
      {levels.map((lvl) => (
        <button
          key={lvl.id}
          onClick={() => onSelect(lvl.id)}
          className="group relative flex items-center gap-4 bg-zinc-900/50 border border-white/5 rounded-2xl p-3 hover:bg-zinc-900 transition-all text-left overflow-hidden active:scale-95"
        >
          {/* Imagen del producto como referencia visual */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
            <Image 
              src={lvl.img} 
              alt={lvl.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          
          <div className="flex-1">
            <h4 className="text-xs font-black text-white uppercase italic tracking-tighter">{lvl.name} Level</h4>
            <p className="text-[14px] font-black text-[oklch(0.55_0.15_45)]">{lvl.reward}</p>
          </div>

          <div className="text-right pr-2">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{lvl.difficulty}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

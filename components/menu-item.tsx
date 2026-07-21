"use client"

import Image from "next/image"
import { Flame, Star, ArrowUpRight } from "lucide-react"

// 1. Interfaz de los valores nutrimentales
export interface NutritionInfo {
  calories: string
  protein: string
  fat: string
  carbs: string
  sodium: string
}

interface MenuItemProps {
  name: string
  description: string
  price: string
  image: string
  tags?: string[]
  isPopular?: boolean
  isSpicy?: boolean
  inStock?: boolean
  nutrition?: NutritionInfo // 2. Propiedad opcional añadida
  onClick?: () => void
}

export function MenuItem({
  name,
  price,
  image,
  tags = [],
  isPopular = false,
  isSpicy = false,
  inStock,
  nutrition,
  onClick,
}: MenuItemProps) {
  return (
    <div
      // Se cambió 'button' por 'div' agregando 'cursor-pointer' y 'text-left' para mantener el comportamiento exacto, respetando tu diseño intacto.
      className="group relative flex w-full cursor-pointer text-left flex-col overflow-hidden rounded-[2rem] bg-zinc-900/40 border border-white/5 p-2 shadow-xl transition-all duration-300 hover:bg-zinc-800/60 hover:border-white/20 active:scale-[0.98]"
      onClick={onClick}
    >
      <div className={`relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-zinc-950 shadow-inner ${inStock === false ? "opacity-30 grayscale" : ""}`}>
        <Image
          src={image}
          alt={name}
          fill
          // Tu zoom sutil original
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {inStock === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <span className="rounded-full bg-zinc-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 shadow-2xl">
              Agotado
            </span>
          </div>
        )}

        {/* Badges originales */}
        <div className="absolute left-3 top-3 flex gap-2 z-20">
          {isPopular && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            </div>
          )}
          {isSpicy && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            </div>
          )}
        </div>

        {/* Indicador de Acción visual original */}
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100 z-20">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col px-3 py-4 text-left">
        <h3 className="text-sm font-semibold leading-tight tracking-tight text-zinc-100">
          {name}
        </h3>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-lg font-black tracking-tight text-white">{price}</span>
          {tags.length > 0 && (
            <span className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              {tags[0]}
            </span>
          )}
        </div>

        {/* 3. BLOQUE NUTRIMENTAL AÑADIDO (No modifica el diseño de arriba) */}
        {nutrition && (
          <details
            className="group/nutri mt-4 border-t border-white/10 pt-3"
            onClick={(e) => e.stopPropagation()} // Evita que se dispare el clic del producto al abrir el acordeón
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              Valores Nutrimentales
              <span className="text-lg transition-transform group-open/nutri:rotate-45">+</span>
            </summary>

            <div className="mt-3 rounded-xl bg-black/20 p-3">
              <table className="w-full text-left text-[11px] text-zinc-400">
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-1.5">Energía</td>
                    <td className="py-1.5 text-right font-bold text-white">{nutrition.calories}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Proteína</td>
                    <td className="py-1.5 text-right font-bold text-white">{nutrition.protein}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Grasas Totales</td>
                    <td className="py-1.5 text-right font-bold text-white">{nutrition.fat}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Carbohidratos</td>
                    <td className="py-1.5 text-right font-bold text-white">{nutrition.carbs}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Sodio</td>
                    <td className="py-1.5 text-right font-bold text-white">{nutrition.sodium}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        )}
        {/* FIN DEL BLOQUE NUTRIMENTAL */}

      </div>
    </div>
  )
}
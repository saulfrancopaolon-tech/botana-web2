"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useCart } from "./cart-context"
import type { Product, ProductGroup } from "@/lib/products"
import { buildGroups } from "@/lib/products"

interface GridProps {
  products: Product[]
  onProductClick: (p: Product) => void
  onAddToCart: (p: Product) => void
  showGroups: boolean
}

export function ProductGrid({ products, onProductClick, onAddToCart, showGroups }: GridProps) {
  const { addItem } = useCart()

  if (!products.length) {
    return (
      <div className="text-center py-20 text-white/30">
        <p className="text-4xl mb-3">🌶</p>
        <p className="text-sm uppercase tracking-widest font-bold">Proximamente mas sorpresas...</p>
      </div>
    )
  }

  // "Todos" → carousel group cards
  if (showGroups) {
    const items = buildGroups(products)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map(item => {
          if ("products" in item) {
            return (
              <GroupCard
                key={item.groupId}
                group={item}
                onProductClick={onProductClick}
                onAddToCart={p => { addItem(p); onAddToCart(p) }}
              />
            )
          }
          return (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => onProductClick(item)}
              onQuickAdd={e => { e.stopPropagation(); addItem(item); onAddToCart(item) }}
            />
          )
        })}
      </div>
    )
  }

  // Categoria especifica → una tarjeta por producto
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onClick={() => onProductClick(p)}
          onQuickAdd={e => { e.stopPropagation(); addItem(p); onAddToCart(p) }}
        />
      ))}
    </div>
  )
}

// ── GROUP CARD (carousel automatico) ──
interface GroupCardProps {
  group: ProductGroup
  onProductClick: (p: Product) => void
  onAddToCart: (p: Product) => void
}

function GroupCard({ group, onProductClick, onAddToCart }: GroupCardProps) {
  const [active, setActive] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const p = group.products[active]

  function startAuto() {
    intervalRef.current = setInterval(() => {
      setActive(i => (i + 1) % group.products.length)
    }, 2200)
  }

  function stopAuto() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    startAuto()
    return stopAuto
  }, [group.products.length])

  return (
    <div
      className="group bg-[#111] border border-white/[.07] rounded-[1.4rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E53E3E]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,.5)]"
      onTouchStart={stopAuto}
      onTouchEnd={startAuto}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* Imagen — tap abre producto activo */}
      <div
        className="aspect-square bg-[#181818] relative overflow-hidden cursor-pointer"
        onClick={() => onProductClick(p)}
      >
        <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
          {p.emoji}
        </div>
        <Image
          src={p.img}
          alt={p.name}
          fill
          className="object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {group.pop && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-[#E53E3E] text-white px-2 py-0.5 rounded-full">
              Top
            </span>
          )}
          <span className="text-[.55rem] font-black tracking-[.1em] uppercase bg-black/60 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {group.products.length} sabores
          </span>
        </div>
        {/* Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {group.products.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setActive(i) }}
              className={
                i === active
                  ? "w-4 h-1.5 rounded-full bg-white transition-all"
                  : "w-1.5 h-1.5 rounded-full bg-white/40 transition-all"
              }
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 cursor-pointer" onClick={() => onProductClick(p)}>
        <div className="font-bold text-[.85rem] text-white leading-tight mb-0.5">
          {p.flavor}
        </div>
        <div className="text-[.65rem] text-white/30 mb-2 truncate">
          {group.products.map(x => x.flavor).join(" · ")}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono font-bold text-white text-[1rem]">${p.price}</span>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(p) }}
            aria-label={"Agregar " + p.name}
            className="w-8 h-8 rounded-full bg-[#E53E3E] flex items-center justify-center hover:bg-[#FF5252] hover:scale-110 transition-all flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Pills de sabores */}
      <div className="px-3 pb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {group.products.map((variant, i) => (
          <button
            key={variant.id}
            onClick={e => { e.stopPropagation(); setActive(i) }}
            className={
              i === active
                ? "flex-shrink-0 text-[.58rem] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E53E3E] text-white transition-all"
                : "flex-shrink-0 text-[.58rem] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 transition-all"
            }
          >
            {variant.flavor}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── TARJETA INDIVIDUAL ──
interface CardProps {
  product: Product
  onClick: () => void
  onQuickAdd: (e: React.MouseEvent) => void
}

function ProductCard({ product: p, onClick, onQuickAdd }: CardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick()}
      className={
        "group bg-[#111] border border-white/[.07] rounded-[1.4rem] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E53E3E]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,.5)] " +
        (!p.inStock ? "opacity-40 pointer-events-none" : "")
      }
    >
      <div className="aspect-square bg-[#181818] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500 select-none">
          {p.emoji}
        </div>
        <Image
          src={p.img}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {p.pop && p.inStock && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-[#E53E3E] text-white px-2 py-0.5 rounded-full">Top</span>
          )}
          {p.spicy && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316] px-2 py-0.5 rounded-full">Picante</span>
          )}
          {p.natural && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full">Natural</span>
          )}
          {!p.inStock && (
            <span className="text-[.55rem] font-black tracking-[.12em] uppercase bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">Agotado</span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="font-bold text-[.85rem] text-white leading-tight mb-1">{p.name}</div>
        <div className="text-[.7rem] text-white/35 leading-snug mb-3 line-clamp-2">{p.desc}</div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono font-bold text-white text-[1rem]">${p.price}</span>
          <button
            onClick={onQuickAdd}
            aria-label={"Agregar " + p.name}
            className="w-8 h-8 rounded-full bg-[#E53E3E] flex items-center justify-center hover:bg-[#FF5252] hover:scale-110 transition-all flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"
import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { Product } from "@/app/page"

interface CartItem extends Product { qty: number }
interface CartCtx {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (p: Product, qty?: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const Ctx = createContext<CartCtx>({
  items: [], totalItems: 0, totalPrice: 0,
  addItem: () => {}, removeItem: () => {}, clearCart: () => {}
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((p: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === p.id)
      if (existing) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...p, qty }]
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0)

  return <Ctx.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, clearCart }}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)

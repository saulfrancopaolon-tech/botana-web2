"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { ShoppingBag, X, Plus, Minus, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: { id: string; name: string; price: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // --- CORRECCIÓN DEFINITIVA AL BLOQUEO DE CLICKS ---
  useEffect(() => {
    if (isOpen) {
      // Bloqueamos solo el scroll, permitiendo la interacción
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px" // Evita saltos visuales en desktop
    } else {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }

    // Limpieza al desmontar para que NUNCA se quede bloqueado
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const getTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleWhatsAppCheckout = (phone: string, name: string) => {
    if (cart.length === 0) return
    let message = `Hola ${name}! quiero hacer un pedido de BOTA-NA:%0A%0A`
    cart.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} ($${item.price * item.quantity})%0A`
    })
    message += `%0A*Total: $${getTotal()}*%0A%0A¿Dónde nos vemos para la entrega?`
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotal }}>
      {children}

      <AnimatePresence>
        {isMounted && totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[oklch(0.55_0.15_45)] text-white shadow-[0_10px_25px_rgba(194,65,12,0.4)] border border-white/10"
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              <motion.span 
                key={totalItems}
                initial={{ scale: 1.5, backgroundColor: "#ffffff", color: "#000" }}
                animate={{ scale: 1, backgroundColor: "#000000", color: "#fff" }}
                className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white border-2 border-zinc-950 text-[10px] font-black"
              >
                {totalItems}
              </motion.span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMounted && isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-zinc-950 border-l border-white/5 shadow-2xl flex flex-col h-full"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[oklch(0.55_0.15_45)] flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  TU PEDIDO
                </h2>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-2 bg-white/5 text-zinc-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center opacity-20 text-white">
                    <ShoppingBag className="h-16 w-16 mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Vacío</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div layout key={item.id} className="flex items-center justify-between rounded-[1.5rem] bg-white/5 p-4 border border-white/5">
                      <div className="flex-1">
                        <h3 className="font-black text-white text-sm uppercase tracking-tight">{item.name}</h3>
                        <p className="text-[oklch(0.55_0.15_45)] font-black text-sm">${item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/40 rounded-full px-3 py-1.5 border border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-zinc-500 hover:text-white transition-all">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-zinc-500 hover:text-white transition-all">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 bg-zinc-900/50 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Estimado</span>
                  <span className="text-3xl font-black text-white tracking-tighter">${getTotal()}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleWhatsAppCheckout("524774950232", "Saúl")} className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-black px-6 py-4 font-black shadow-xl active:scale-95 transition-all">
                    <Send className="h-5 w-5" /> PEDIR A SAÚL
                  </button>
                  <button onClick={() => handleWhatsAppCheckout("524761004512", "Aranza")} className="w-full flex items-center justify-center gap-3 rounded-2xl bg-zinc-800 text-white px-6 py-4 font-black border border-white/5 active:scale-95 transition-all">
                    <Send className="h-5 w-5" /> PEDIR A ARANZA
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}

"use client"

import Image from "next/image"
import { useState } from "react"
import { MapPin, Instagram, Wallet, Store, Menu } from "lucide-react"
import { LoyaltyWallet } from "./loyalty-wallet"
import { WholesaleModal } from "./WholesaleModal"
import { MobileMenu } from "./mobile-menu"

interface MenuHeaderProps {
  categories: string[]
  onCategoryChange: (cat: string) => void
}

export function MenuHeader({ categories, onCategoryChange }: MenuHeaderProps) {
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/90 py-4 text-center backdrop-blur-2xl">
        
        {/* 1. BOTÓN MENÚ LATERAL */}
        <div className="absolute top-3 left-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90 shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* 2. BOTÓN MAYOREO */}
        <div className="absolute top-3 right-4">
          <button
            onClick={() => setIsWholesaleOpen(true)}
            className="group relative flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 text-[9px] font-black text-orange-500 hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.1)] h-10"
          >
            <Store className="h-3 w-3" />
            <span className="hidden sm:inline">Mayoreo</span>
          </button>
        </div>

        {/* 3. LOGO CENTRAL */}
        <div className="container mx-auto px-4 mt-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center transition-transform duration-500 hover:scale-105">
              <Image
                src="/images/logo-botana.png"
                alt="BOTA-NA Logo"
                width={200}
                height={120}
                className="h-auto w-36 sm:w-48"
                priority
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <MapPin className="h-3 w-3 text-zinc-700" />
                Leon Gto.
                <span className="mx-1 h-1 w-1 rounded-full bg-zinc-700" />
                Snacks Premium
              </p>

              <div className="flex gap-3">
                <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <Instagram className="h-3.5 w-3.5 text-zinc-700" />
                  <span>INSTAGRAM</span>
                </a>
                <button onClick={() => setIsWalletOpen(true)} className="group flex items-center gap-2 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 px-4 py-2 text-[11px] font-black tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                  <Wallet className="h-3.5 w-3.5 text-white" />
                  <span>MI TARJETA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onCategorySelect={onCategoryChange} onOpenWholesale={() => setIsWholesaleOpen(true)} categories={categories} />
      <LoyaltyWallet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <WholesaleModal isOpen={isWholesaleOpen} onClose={() => setIsWholesaleOpen(false)} />
    </>
  )
}

"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BotaBreaker } from "./bota-breaker"
import { LevelSelector } from "./level-selector"

export function BotaArcade({ onReward, onCancel }: { onReward: (reward: string) => void, onCancel: () => void }) {
  const [step, setStep] = useState<'selector' | 'playing'>('selector')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const handleWin = () => {
    // Definimos qué premio se lleva según el ID del nivel
    const rewards = { 
      1: "1.5 Puntos en BotaCard", 
      2: "Cupón 15% Descuento", 
      3: "Producto Gratis ($20)" 
    }
    onReward(rewards[selectedLevel as keyof typeof rewards])
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 'selector' ? (
          <motion.div 
            key="selector" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <LevelSelector onSelect={(id) => {
              setSelectedLevel(id)
              setStep('playing')
            }} />
            <button 
              onClick={onCancel}
              className="w-full mt-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
            >
              Regresar
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="playing" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <BotaBreaker 
              level={selectedLevel as 1 | 2 | 3} 
              onWin={handleWin}
              onLoss={() => setStep('selector')} // Si pierde, regresa a elegir nivel
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

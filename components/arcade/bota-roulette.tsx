"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Ban, Tag, PlusCircle, Gift, Zap } from "lucide-react"

const PRIZES = [
  { id: 0, label: "Nada", icon: Ban, color: "#18181b", weight: 60 },
  { id: 1, label: "10% OFF", icon: Tag, color: "#27272a", weight: 20 },
  { id: 2, label: "15% OFF", icon: Tag, color: "#3f3f46", weight: 12 },
  { id: 3, label: "1 Punto", icon: PlusCircle, color: "#52525b", weight: 6 },
  { id: 4, label: "GRATIS", icon: Gift, color: "oklch(0.55 0.15 45)", weight: 2 },
]

export function BotaRoulette({ onFinish }: { onFinish: (prize: any) => void }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [finalPrize, setFinalPrize] = useState<any>(null)

  const spin = () => {
    if (isSpinning) return
    setIsSpinning(false)
    setShowResult(false)
    setIsSpinning(true)

    // Lógica de probabilidades (Pesada)
    const random = Math.random() * 100
    let cumulativeWeight = 0
    let selectedPrize = PRIZES[0]

    for (const prize of PRIZES) {
      cumulativeWeight += prize.weight
      if (random < cumulativeWeight) {
        selectedPrize = prize
        break
      }
    }

    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id)
    const extraSpins = 8 * 360 // Más vueltas para más drama
    const sectorAngle = 360 / PRIZES.length
    // Ajuste para que la flecha quede en el centro del segmento
    const finalRotation = rotation + extraSpins + (360 - (prizeIndex * sectorAngle))

    setRotation(finalRotation)
    setFinalPrize(selectedPrize)

    setTimeout(() => {
      setIsSpinning(false)
      setShowResult(true)
      setTimeout(() => onFinish(selectedPrize), 3000)
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="relative h-72 w-72">
        {/* Anillo exterior decorativo (Look Industrial) */}
        <div className="absolute -inset-4 rounded-full border border-white/5 bg-zinc-900/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
        
        {/* Marcador (Puntero Industrial) */}
        <div className="absolute -top-6 left-1/2 z-30 -translate-x-1/2">
          <motion.div 
            animate={isSpinning ? { rotate: [0, -10, 10, 0], y: [0, 2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="h-8 w-1 bg-white shadow-[0_0_10px_white]" />
            <div className="h-2 w-2 rounded-full bg-white" />
          </motion.div>
        </div>

        {/* La Ruleta */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.15, 0, 0.05, 1] }}
          className="relative h-full w-full rounded-full border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden"
        >
          {PRIZES.map((prize, i) => {
            const Icon = prize.icon
            const angle = 360 / PRIZES.length
            return (
              <div
                key={i}
                className="absolute top-0 left-0 h-full w-full origin-center"
                style={{
                  transform: `rotate(${i * angle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((angle * Math.PI) / 360)}% 0%)`,
                  backgroundColor: prize.color
                }}
              >
                {/* Contenido del Segmento (Icono + Texto) */}
                <div 
                  className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                  style={{ transform: `rotate(${angle / 2}deg)` }}
                >
                  <Icon className="h-5 w-5 text-white/80" />
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-widest vertical-text">
                    {prize.label}
                  </span>
                </div>
              </div>
            )
          })}
          
          {/* Eje Central (Hub) */}
          <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl z-20">
            <Zap className="h-4 w-4 text-white/20" />
          </div>
        </motion.div>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`group relative w-full overflow-hidden rounded-2xl py-5 font-black uppercase tracking-[0.3em] transition-all
            ${isSpinning ? "bg-zinc-900 text-zinc-700" : "bg-white text-black active:scale-95"}
          `}
        >
          <span className="relative z-10">{isSpinning ? "Procesando Suerte..." : "Girar Ruleta"}</span>
          {!isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </button>

        <p className="text-center text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
          Costo: 1 Código de Compra (No reembolsable)
        </p>
      </div>

      {/* Overlay de Resultado */}
      <AnimatePresence>
        {showResult && finalPrize && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-[2.5rem] p-8 text-center"
          >
            <finalPrize.icon className={`h-16 w-16 mb-4 ${finalPrize.label === 'Nada' ? 'text-zinc-600' : 'text-white'}`} />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {finalPrize.label === 'Nada' ? 'Suerte para la próxima' : `¡${finalPrize.label}!`}
            </h2>
            <p className="mt-2 text-[10px] text-zinc-500 font-bold uppercase">
              {finalPrize.label === 'Nada' ? 'Sigue participando' : 'Toma screenshot para canjear'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

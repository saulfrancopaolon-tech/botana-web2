"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string;
}

export function BotaBreaker({ level, onWin, onLoss }: { level: 1 | 2 | 3, onWin: () => void, onLoss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  
  // Configuración de niveles "PRO"
  const config = {
    1: { speed: 4, paddleWidth: 100, rows: 3, color: "#71717a" }, // Zinc
    2: { speed: 5.5, paddleWidth: 80, rows: 5, color: "#a1a1aa" }, // Zinc claro
    3: { speed: 7.5, paddleWidth: 60, rows: 7, color: "oklch(0.55 0.15 45)" } // BOTA-NA Orange
  }[level]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Variables de estado del juego
    let ballX = canvas.width / 2
    let ballY = canvas.height - 40
    let dx = (Math.random() - 0.5) * config.speed
    let dy = -config.speed
    let paddleX = (canvas.width - config.paddleWidth) / 2
    let particles: Particle[] = []
    
    // Crear ladrillos
    const brickRowCount = config.rows
    const brickColumnCount = 5
    const brickPadding = 6
    const brickWidth = (canvas.width - (brickPadding * (brickColumnCount + 1))) / brickColumnCount
    const brickHeight = 16
    const brickOffsetTop = 50
    const bricks: any[] = []

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = []
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }
      }
    }

    const createParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 1.0,
          color
        })
      }
    }

    const drawParticles = () => {
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 3, 3)
        if (p.life <= 0) particles.splice(i, 1)
      })
      ctx.globalAlpha = 1.0
    }

    const drawBall = () => {
      // Glow de la bola
      ctx.shadowBlur = 15
      ctx.shadowColor = "rgba(255,255,255,0.5)"
      ctx.beginPath()
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.closePath()
      ctx.shadowBlur = 0 // Reset para lo demás
    }

    const drawPaddle = () => {
      ctx.fillStyle = config.color
      ctx.beginPath()
      // Estética industrial: Paleta con bordes redondeados
      ctx.roundRect(paddleX, canvas.height - 20, config.paddleWidth, 8, 4)
      ctx.fill()
      ctx.closePath()
    }

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const bx = c * (brickWidth + brickPadding) + brickPadding
            const by = r * (brickHeight + brickPadding) + brickOffsetTop
            bricks[c][r].x = bx
            bricks[c][r].y = by
            
            // Estética de bloques: Glassmorphism sutil
            ctx.fillStyle = "rgba(255,255,255,0.08)"
            ctx.strokeStyle = "rgba(255,255,255,0.1)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.roundRect(bx, by, brickWidth, brickHeight, 3)
            ctx.fill()
            ctx.stroke()
          }
        }
      }
    }

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r]
          if (b.status === 1) {
            if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
              dy = -dy
              b.status = 0
              createParticles(ballX, ballY, config.color)
              if (bricks.flat().every(br => br.status === 0)) {
                setGameState('won')
                setTimeout(onWin, 1000)
                return true
              }
            }
          }
        }
      }
      return false
    }

    const update = () => {
      if (gameState !== 'playing') return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dibujar fondo sutil (Grid industrial)
      ctx.strokeStyle = "rgba(255,255,255,0.02)"
      for(let i=0; i<canvas.width; i+=20) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke()
      }

      drawBricks()
      drawBall()
      drawPaddle()
      drawParticles()
      
      if (collisionDetection()) return

      // Rebotes paredes
      if (ballX + dx > canvas.width - 5 || ballX + dx < 5) dx = -dx
      if (ballY + dy < 5) dy = -dy
      else if (ballY + dy > canvas.height - 25) {
        if (ballX > paddleX && ballX < paddleX + config.paddleWidth) {
          // Rebote dinámico según dónde pegue en la paleta
          const hitPoint = (ballX - (paddleX + config.paddleWidth / 2)) / (config.paddleWidth / 2)
          dx = hitPoint * config.speed
          dy = -dy
        } else if (ballY + dy > canvas.height) {
          setGameState('lost')
          setTimeout(onLoss, 1000)
          return
        }
      }

      ballX += dx
      ballY += dy
      requestAnimationFrame(update)
    }

    // Control Touch suave
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      paddleX = Math.max(0, Math.min(x - config.paddleWidth / 2, canvas.width - config.paddleWidth))
    }

    canvas.addEventListener('touchmove', handleTouch, { passive: false })
    const animationId = requestAnimationFrame(update)

    return () => {
      canvas.removeEventListener('touchmove', handleTouch)
      cancelAnimationFrame(animationId)
    }
  }, [level, gameState])

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-b from-white/10 to-transparent">
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={480} 
          className="rounded-[2.3rem] bg-zinc-950 shadow-2xl"
        />
        
        {/* Overlay de estado */}
        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[2.3rem]"
            >
              <h2 className={`text-4xl font-black italic uppercase ${gameState === 'won' ? 'text-white' : 'text-zinc-500'}`}>
                {gameState === 'won' ? '¡Nivel Superado!' : 'Game Over'}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Nivel: {level === 3 ? 'PAPAS FUEGO' : level === 2 ? 'CHIPS' : 'CACAHUATE'}</p>
        <p className="text-[8px] font-bold text-zinc-700 uppercase italic">Usa tu dedo para mover la paleta</p>
      </div>
    </div>
  )
}

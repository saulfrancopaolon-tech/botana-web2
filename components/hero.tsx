"use client"
import { useEffect, useRef } from "react"

interface HeroProps {
  onMenuClick: () => void
  onWholesaleOpen: () => void
}

export function Hero({ onMenuClick, onWholesaleOpen }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas particle field
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    // Particle definition
    interface Particle {
      x: number; y: number
      vx: number; vy: number
      radius: number
      alpha: number
      alphaDir: number
      color: string
    }

    const COLORS = [
      "rgba(229,62,62,",   // red
      "rgba(249,115,22,",  // orange
      "rgba(180,40,40,",   // dark red
    ]

    let particles: Particle[] = []

    function resize() {
      W = canvas!.offsetWidth
      H = canvas!.offsetHeight
      canvas!.width  = W
      canvas!.height = H
      init()
    }

    function randomParticle(): Particle {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.25 + 0.05,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color,
      }
    }

    function init() {
      const count = Math.floor((W * H) / 9000)
      particles = Array.from({ length: Math.min(count, 90) }, randomParticle)
    }

    // Connection lines between nearby particles
    function drawConnections() {
      const MAX_DIST = 130
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.06
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = "rgba(229,62,62," + opacity + ")"
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
    }

    function tick() {
      ctx!.clearRect(0, 0, W, H)

      // Draw connections first (behind particles)
      drawConnections()

      for (const p of particles) {
        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < -2)  p.x = W + 2
        if (p.x > W+2) p.x = -2
        if (p.y < -2)  p.y = H + 2
        if (p.y > H+2) p.y = -2

        // Breathe alpha
        p.alpha += p.alphaDir * 0.003
        if (p.alpha > 0.30) p.alphaDir = -1
        if (p.alpha < 0.04) p.alphaDir =  1

        // Draw dot
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = p.color + p.alpha + ")"
        ctx!.fill()
      }

      animId = requestAnimationFrame(tick)
    }

    resize()
    tick()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  // Parallax on scroll
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const layer = hero.querySelector(".hero-bg-layer") as HTMLElement
    const onScroll = () => {
      if (layer) layer.style.transform = "translateY(" + String(window.scrollY * 0.22) + "px)"
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.25rem 3rem", overflow: "hidden" }}
    >
      {/* ── BACKGROUND ── */}
      <div className="hero-bg-layer" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* Radial glow — red center */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 44%, rgba(229,62,62,0.10) 0%, transparent 68%)" }} />

        {/* Subtle top arc */}
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "110%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Faint large bg text */}
        <div style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(8rem,22vw,22rem)", color: "rgba(229,62,62,0.04)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", letterSpacing: "-.02em", userSelect: "none", pointerEvents: "none" }}>
          BOTANA
        </div>

        {/* Vignette — fades edges so canvas doesnt distract */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,10,10,0.88) 100%)" }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 820 }}>

        {/* Eyebrow */}
        <div
          className="animate-fade-in"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.28)", borderRadius: 999, padding: "6px 16px", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "1.75rem", animationDelay: "80ms", animationFillMode: "both" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E", display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
          Leon, Gto. · La Salle Bajio
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.8rem,13vw,9rem)", lineHeight: .92, letterSpacing: ".02em", color: "white", marginBottom: "1.1rem", animationDelay: "180ms", animationFillMode: "both" }}
        >
          El Sabor<br />Que <span style={{ color: "#E53E3E" }}>Mueve</span>
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-in-up"
          style={{ fontSize: "clamp(.9rem,2.8vw,1.1rem)", color: "rgba(255,255,255,0.46)", maxWidth: 460, margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.75, animationDelay: "300ms", animationFillMode: "both" }}
        >
          Snacks irresistibles seleccionados para hacerte la jornada mas sabrosa.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up"
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", animationDelay: "420ms", animationFillMode: "both" }}
        >
          <button
            onClick={onMenuClick}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 999, background: "#E53E3E", color: "white", fontWeight: 800, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(229,62,62,0.35)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.transform = "translateY(-2px)"; b.style.boxShadow = "0 14px 36px rgba(229,62,62,0.45)" }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.transform = "none"; b.style.boxShadow = "0 8px 28px rgba(229,62,62,0.35)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
            Ver Menu
          </button>
          <button
            onClick={onWholesaleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)", color: "white", fontWeight: 600, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", background: "transparent", cursor: "pointer", transition: "border-color 0.25s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)" }}
          >
            Mayoreo y Eventos
          </button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in"
          style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,5vw,4rem)", marginTop: "3.5rem", flexWrap: "wrap", animationDelay: "580ms", animationFillMode: "both" }}
        >
          {[["16+", "Productos"], ["$15", "Desde"], ["10pts", "Premio"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2rem,4vw,2.8rem)", lineHeight: 1, color: "white", display: "block" }}>{num}</span>
              <span style={{ fontSize: ".63rem", color: "rgba(255,255,255,0.26)", letterSpacing: ".14em", textTransform: "uppercase", marginTop: 4, display: "block" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

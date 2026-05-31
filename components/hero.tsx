"use client"
import { useEffect, useRef } from "react"

interface HeroProps {
  onMenuClick: () => void
  onWholesaleOpen: () => void
}

// Productos flotantes — posiciones y velocidades variadas
const FLOATING_ITEMS = [
  { emoji: "🥜", size: 2.8, x: 8,  y: 15, duration: 7.2, delay: 0,    orbit: 18 },
  { emoji: "🔥", size: 2.2, x: 88, y: 20, duration: 8.5, delay: 1.2,  orbit: 14 },
  { emoji: "🥭", size: 3.0, x: 5,  y: 65, duration: 9.1, delay: 0.5,  orbit: 20 },
  { emoji: "🐻", size: 2.4, x: 90, y: 55, duration: 7.8, delay: 2.0,  orbit: 16 },
  { emoji: "🍠", size: 2.0, x: 15, y: 80, duration: 8.2, delay: 3.1,  orbit: 12 },
  { emoji: "🌺", size: 2.5, x: 82, y: 80, duration: 9.5, delay: 1.8,  orbit: 18 },
  { emoji: "🍓", size: 2.1, x: 50, y: 5,  duration: 7.5, delay: 4.0,  orbit: 10 },
  { emoji: "🪱", size: 1.8, x: 22, y: 45, duration: 11,  delay: 0.8,  orbit: 22 },
  { emoji: "🥛", size: 2.3, x: 75, y: 10, duration: 8.8, delay: 2.5,  orbit: 15 },
  { emoji: "🍋", size: 2.0, x: 60, y: 88, duration: 10,  delay: 1.5,  orbit: 13 },
]

export function Hero({ onMenuClick, onWholesaleOpen }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)

  // Parallax suave en scroll
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const layer = hero.querySelector(".hero-parallax") as HTMLElement
    const onScroll = () => {
      if (layer) layer.style.transform = "translateY(" + String(window.scrollY * 0.28) + "px)"
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.25rem 3rem", overflow: "hidden" }}
    >
      {/* ── BACKGROUND LAYERS ── */}
      <div className="hero-parallax" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Glow central */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 42%, rgba(229,62,62,0.11) 0%, transparent 70%)" }} />

        {/* Texto de fondo grande */}
        <div style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(8rem,22vw,22rem)", color: "rgba(255,255,255,0.022)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", letterSpacing: "-.02em", pointerEvents: "none", userSelect: "none" }}>
          BOTANA
        </div>

        {/* ── FLOATING PRODUCTS ── */}
        <style>{`
          @keyframes heroFloat {
            0%   { transform: translateY(0px) rotate(0deg); }
            33%  { transform: translateY(-14px) rotate(4deg); }
            66%  { transform: translateY(-7px) rotate(-3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes heroPulseOpacity {
            0%, 100% { opacity: var(--op-base); }
            50%       { opacity: var(--op-peak); }
          }
          .hero-emoji-wrap {
            position: absolute;
            animation:
              heroFloat var(--dur) ease-in-out infinite,
              heroPulseOpacity calc(var(--dur) * 1.4) ease-in-out infinite;
            will-change: transform, opacity;
            filter: drop-shadow(0 4px 16px rgba(0,0,0,0.35));
          }
        `}</style>

        {FLOATING_ITEMS.map((item, i) => (
          <div
            key={i}
            className="hero-emoji-wrap"
            style={{
              left: item.x + "%",
              top: item.y + "%",
              fontSize: item.size + "rem",
              lineHeight: 1,
              "--dur": item.duration + "s",
              "--op-base": "0.55",
              "--op-peak": "0.8",
              animationDelay: item.delay + "s",
              animationDuration: item.duration + "s",
            } as React.CSSProperties}
          >
            {item.emoji}
          </div>
        ))}

        {/* Vignette edges — para que los emojis se "pierdan" en los bordes */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 55%, rgba(10,10,10,0.92) 100%)", pointerEvents: "none" }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 820 }}>

        {/* Eyebrow */}
        <div
          className="animate-fade-in"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 999, padding: "6px 16px", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "1.75rem", animationDelay: "100ms", animationFillMode: "both" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E", display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
          Leon, Gto. · La Salle Bajio
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.8rem,13vw,9rem)", lineHeight: .92, letterSpacing: ".02em", color: "white", marginBottom: "1.1rem", animationDelay: "200ms", animationFillMode: "both" }}
        >
          El Sabor<br />Que <span style={{ color: "#E53E3E" }}>Mueve</span>
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-in-up"
          style={{ fontSize: "clamp(.9rem,2.8vw,1.1rem)", color: "rgba(255,255,255,0.48)", maxWidth: 460, margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.75, animationDelay: "340ms", animationFillMode: "both" }}
        >
          Snacks irresistibles seleccionados para hacerte la jornada mas sabrosa.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up"
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", animationDelay: "460ms", animationFillMode: "both" }}
        >
          <button
            onClick={onMenuClick}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 999, background: "#E53E3E", color: "white", fontWeight: 800, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(229,62,62,0.35)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 36px rgba(229,62,62,0.45)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(229,62,62,0.35)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
            Ver Menu
          </button>
          <button
            onClick={onWholesaleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", background: "transparent", cursor: "pointer", transition: "all 0.25s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.35)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)" }}
          >
            Mayoreo y Eventos
          </button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in"
          style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,5vw,4rem)", marginTop: "3.5rem", flexWrap: "wrap", animationDelay: "620ms", animationFillMode: "both" }}
        >
          {[["16+", "Productos"], ["$15", "Desde"], ["10pts", "Premio"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2rem,4vw,2.8rem)", lineHeight: 1, color: "white", display: "block" }}>{num}</span>
              <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,0.28)", letterSpacing: ".14em", textTransform: "uppercase", marginTop: 4, display: "block" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

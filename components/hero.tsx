"use client"
import { useEffect, useState } from "react"

interface HeroProps {
  onMenuClick: () => void
}

// ── Frases rotativas del hero ────────────────────────────────────────
// Cortas (una linea) para que la animacion no ocupe espacio de mas.
// Cada una lleva su propio tono de resplandor — siempre dentro de la
// paleta de marca (rojos/naranjas), para verse profesional y coherente.
const PHRASES: { text: string; glow: string }[] = [
  { text: "El antojo que no puede esperar",     glow: "rgba(229,62,62,0.32)"  },
  { text: "Se acaba rapido. Siempre.",           glow: "rgba(245,130,10,0.30)" },
  { text: "Picante, crocante, imposible de soltar", glow: "rgba(229,62,62,0.28)" },
  { text: "Tu break sabe mejor aqui",     glow: "rgba(251,146,60,0.30)" },
  { text: "La bolsa nunca alcanza",              glow: "rgba(229,62,62,0.32)"  },
  { text: "El sabor que piden dos veces",        glow: "rgba(245,130,10,0.28)" },
  { text: "Antojo detectado. Resuelvelo ya",     glow: "rgba(229,62,62,0.30)"  },
  { text: "De la mochila a la boca en segundos", glow: "rgba(251,146,60,0.28)" },
]

const ROTATE_MS = 2600

export function Hero({ onMenuClick }: HeroProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % PHRASES.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const prevIndex = (index - 1 + PHRASES.length) % PHRASES.length

  return (
    <section
      style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.25rem 3rem", overflow: "hidden" }}
    >
      {/* ── Glow de fondo — transiciona de color con cada frase (una sola propiedad, muy barato) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 46% at 50% 42%, " + PHRASES[index].glow + ", transparent 72%)",
          transition: "background 1.1s ease",
        }}
      />

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 760, width: "100%" }}>

        {/* Eyebrow */}
        <div
          className="animate-fade-in"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.28)", borderRadius: 999, padding: "6px 16px", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "1.75rem", animationDelay: "80ms", animationFillMode: "both" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E", display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
          Leon, Gto. · La Salle Bajio
        </div>

        {/* ── FRASE ANIMADA — protagonista visual, estilo iOS (spring + blur) ── */}
        <div className="hero-phrase-stage animate-fade-in" style={{ animationDelay: "140ms", animationFillMode: "both" }}>
          {PHRASES.map((p, i) => (
            <span
              key={p.text}
              className={"hero-phrase-item" + (i === index ? " active" : i === prevIndex ? " prev" : "")}
            >
              {p.text}
            </span>
          ))}
        </div>

        {/* Wordmark chico debajo — la marca siempre visible, sin competir */}
        <div
          className="animate-fade-in-up"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem", letterSpacing: ".22em", color: "rgba(255,255,255,0.3)", marginBottom: "1.75rem", animationDelay: "220ms", animationFillMode: "both" }}
        >
          BOTA<span style={{ color: "#E53E3E" }}>-</span>NA · SNACKS PREMIUM
        </div>

        {/* Sub */}
        <p
          className="animate-fade-in-up"
          style={{ fontSize: "clamp(.88rem,2.6vw,1rem)", color: "rgba(255,255,255,0.46)", maxWidth: 420, margin: "0 auto 2.25rem", fontWeight: 300, lineHeight: 1.7, animationDelay: "300ms", animationFillMode: "both" }}
        >
          Cacahuates, chips, gomitas, papas y bebidas. Pide en linea y recoge en La Salle Bajio.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", animationDelay: "380ms", animationFillMode: "both" }}
        >
          <button
            onClick={onMenuClick}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 999, background: "#E53E3E", color: "white", fontWeight: 800, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(229,62,62,0.35)", transition: "transform 0.25s var(--spring-soft), box-shadow 0.25s var(--spring-soft)" }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.transform = "translateY(-2px)"; b.style.boxShadow = "0 14px 36px rgba(229,62,62,0.45)" }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.transform = "none"; b.style.boxShadow = "0 8px 28px rgba(229,62,62,0.35)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
            Ver Menu
          </button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in"
          style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,5vw,4rem)", marginTop: "3rem", flexWrap: "wrap", animationDelay: "460ms", animationFillMode: "both" }}
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

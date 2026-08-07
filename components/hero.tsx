"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

interface HeroProps {
  onMenuClick: () => void
}

// Productos destacados para el rotador. Fotos con fondo negro puro:
// con mix-blend-mode "screen" el negro se vuelve transparente y el
// producto queda flotando sobre el color de fondo — sin editar imagenes.
const ROTATOR = [
  { img: "/images/4.webp",  name: "Cacahuate Habanero", glow: "rgba(245,130,10,0.32)" },
  { img: "/images/6.webp",  name: "Chips de Betabel",   glow: "rgba(232,52,26,0.30)"  },
  { img: "/images/9.webp",  name: "Gomitas Gusano",     glow: "rgba(236,72,153,0.26)" },
  { img: "/images/14.webp", name: "Papas Fuego",        glow: "rgba(229,62,62,0.32)"  },
  { img: "/images/69.webp", name: "Chamoyada de Mango", glow: "rgba(245,130,10,0.26)" },
]

const ROTATE_MS = 2800

export function Hero({ onMenuClick }: HeroProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % ROTATOR.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const leftIdx  = (index + ROTATOR.length - 1) % ROTATOR.length
  const rightIdx = (index + 1) % ROTATOR.length

  return (
    <section
      style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.25rem 3rem", overflow: "hidden" }}
    >
      {/* ── Glow de fondo — transiciona de color segun el producto activo (una sola propiedad, muy barato) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 62% 56% at 50% 44%, " + ROTATOR[index].glow + ", transparent 72%)",
          transition: "background 1.1s ease",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 46%, rgba(10,10,10,0.86) 100%)", pointerEvents: "none" }} />

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 820, width: "100%" }}>

        {/* Eyebrow */}
        <div
          className="animate-fade-in"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.28)", borderRadius: 999, padding: "6px 16px", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "1.5rem", animationDelay: "80ms", animationFillMode: "both" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E", display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
          Leon, Gto. · La Salle Bajio
        </div>

        {/* ── ROTADOR DE PRODUCTOS — protagonista visual ── */}
        <div
          className="animate-fade-in"
          style={{ position: "relative", width: "clamp(230px,50vw,360px)", aspectRatio: "1/1", margin: "0 auto 1.25rem", animationDelay: "140ms", animationFillMode: "both" }}
        >
          {/* Peek lateral izquierdo */}
          <div className="hero-side-peek hero-side-peek-l">
            <Image src={ROTATOR[leftIdx].img} alt="" fill sizes="200px" className="hero-rotator-img-el" style={{ objectFit: "contain" }} />
          </div>
          {/* Peek lateral derecho */}
          <div className="hero-side-peek hero-side-peek-r">
            <Image src={ROTATOR[rightIdx].img} alt="" fill sizes="200px" className="hero-rotator-img-el" style={{ objectFit: "contain" }} />
          </div>

          {/* Producto central — crossfade entre todos, sin recargar ni parpadear */}
          {ROTATOR.map((p, i) => (
            <div key={p.img} className={"hero-rotator-stage" + (i === index ? " active" : "")}>
              <Image
                src={p.img}
                alt={p.name}
                fill
                sizes="360px"
                priority={i === 0}
                className="hero-rotator-img-el"
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        {/* Nombre del producto activo */}
        <div style={{ height: 20, marginBottom: "1.75rem" }}>
          <span key={index} className="animate-fade-in" style={{ fontSize: ".72rem", fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", animationDuration: "0.5s" }}>
            {ROTATOR[index].name}
          </span>
        </div>

        {/* Headline — mas compacta, ya no compite con la animacion */}
        <h1
          className="animate-fade-in-up"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.6rem,8vw,4.5rem)", lineHeight: .95, letterSpacing: ".02em", color: "white", marginBottom: "0.9rem", animationDelay: "220ms", animationFillMode: "both" }}
        >
          Snacks Premium <span style={{ color: "#E53E3E" }}>Hechos para Compartir</span>
        </h1>

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

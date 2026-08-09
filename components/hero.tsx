"use client"

interface HeroProps {
  onMenuClick: () => void
}

export function Hero({ onMenuClick }: HeroProps) {
  return (
    <section
      style={{ position: "relative", minHeight: "86vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem 1.25rem", overflow: "hidden" }}
    >
      {/* Resplandor sutil detras del logo — una sola propiedad (opacity), muy barato */}
      <div aria-hidden="true" className="hero-glow-pulse" />

      <div style={{ position: "relative", zIndex: 10 }}>
        <h1
          className="animate-fade-in-up"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(4.2rem,20vw,11rem)", lineHeight: 0.92, letterSpacing: ".01em", color: "white", margin: 0, animationFillMode: "both" }}
        >
          BOTA<span style={{ color: "#E53E3E" }}>-</span>NA
        </h1>

        <div
          className="animate-fade-in-up"
          style={{ marginTop: "2.5rem", animationDelay: "140ms", animationFillMode: "both" }}
        >
          <button
            onClick={onMenuClick}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px", borderRadius: 999, background: "#E53E3E", color: "white", fontWeight: 800, fontSize: ".92rem", letterSpacing: ".06em", textTransform: "uppercase", border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(229,62,62,0.35)", transition: "transform 0.25s var(--spring-soft), box-shadow 0.25s var(--spring-soft)" }}
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
      </div>
    </section>
  )
}

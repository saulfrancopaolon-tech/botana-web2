"use client"

interface HeroProps {
  onMenuClick: () => void
  /** Opcional: abre una categoría al tocar un tile (ej. "Botanas") */
  onPickCategory?: (cat: string) => void
}

const TILES = [
  { cat: "Botanas", title: "Takis", sub: "Fuego & Original", emoji: "🌶️", bg: "linear-gradient(145deg,#5B2A86 0%,#C2185B 100%)" },
  { cat: "Botanas", title: "Barcel", sub: "Chips · Runners", emoji: "🥔", bg: "linear-gradient(145deg,#F59E0B 0%,#EA580C 100%)" },
  { cat: "Dulces",  title: "Vualá",  sub: "Sorpresa de chocolate", emoji: "🍫", bg: "linear-gradient(145deg,#7C4A2D 0%,#3B1F12 100%)" },
]

export function Hero({ onMenuClick, onPickCategory }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pt-14 pb-10 sm:pt-24 sm:pb-16 text-center">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>

      {/* Emojis flotantes (decorativos) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <span className="float-a absolute left-[7%] top-[22%] text-4xl sm:text-6xl opacity-80">🌶️</span>
        <span className="float-b absolute right-[8%] top-[18%] text-4xl sm:text-6xl opacity-80">🍫</span>
        <span className="float-c absolute left-[14%] bottom-[30%] text-3xl sm:text-5xl opacity-60 hidden sm:block">🥜</span>
        <span className="float-a absolute right-[13%] bottom-[34%] text-3xl sm:text-5xl opacity-60 hidden sm:block">🔥</span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="rise inline-flex items-center gap-2 rounded-full glass-2 px-4 py-1.5 text-[.72rem] font-semibold tracking-wide text-white/80" style={{ animationDelay: "40ms" }}>
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#30D158]" />
          Nuevo · Takis, Barcel y Vualá ya disponibles
        </div>

        <h1
          className="rise font-head mt-6 text-[clamp(3.4rem,15vw,9rem)] text-grad-soft"
          style={{ animationDelay: "120ms", lineHeight: 0.95 }}
        >
          Snacks que
          <br />
          <span className="text-grad">rompen.</span>
        </h1>

        <p className="rise mx-auto mt-6 max-w-xl text-[clamp(1rem,2.6vw,1.25rem)] leading-relaxed text-white/60" style={{ animationDelay: "220ms" }}>
          Tus botanas favoritas, a un toque. Pide por WhatsApp y recógelas en La Salle Bajío.
        </p>

        <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "320ms" }}>
          <button onClick={onMenuClick} className="btn-primary w-full sm:w-auto">
            Ver el menú
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
          <a href="/b2b" className="btn-ghost w-full sm:w-auto">Compra por mayoreo</a>
        </div>
      </div>

      {/* Tiles de marcas — bento mini */}
      <div className="relative z-10 mx-auto mt-14 grid max-w-4xl grid-cols-3 gap-3 sm:gap-4">
        {TILES.map((t, i) => (
          <button
            key={t.title}
            onClick={() => onPickCategory?.(t.cat)}
            className="rise group relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-3 pb-4 text-left sm:p-6 transition-transform duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 active:scale-[.97]"
            style={{ background: t.bg, animationDelay: String(420 + i * 90) + "ms", boxShadow: "0 24px 50px -24px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.2)" }}
          >
            <span className="pimg block text-4xl sm:text-6xl drop-shadow-[0_8px_16px_rgba(0,0,0,.35)] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{t.emoji}</span>
            <span className="mt-3 block font-head text-[1.05rem] sm:text-2xl text-white">{t.title}</span>
            <span className="block text-[.62rem] sm:text-xs font-medium text-white/70 leading-tight mt-0.5">{t.sub}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

"use client"
interface HeroProps { onMenuClick: () => void; onWholesaleOpen: () => void }
export function Hero({ onMenuClick, onWholesaleOpen }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(229,62,62,0.12)_0%,transparent_70%)]" />
        <div className="hero-bg-text select-none">BOTANA</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-[#E53E3E]/10 border border-[#E53E3E]/30 rounded-full px-4 py-1.5 text-[.72rem] font-bold tracking-[.15em] uppercase text-[#E53E3E] mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E] animate-pulse" />
          La Salle Bajío · León, Gto.
        </div>

        {/* Headline */}
        <h1 className="font-head text-[clamp(4rem,12vw,9rem)] leading-[.93] tracking-wide text-white mb-5">
          El Sabor<br />Que <span className="text-[#E53E3E]">Mueve</span>
        </h1>

        <p className="text-[clamp(.95rem,2.5vw,1.15rem)] text-white/50 max-w-[520px] mx-auto mb-10 font-light leading-relaxed">
          Snacks artesanales irresistibles. Desde cacahuates holandeses hasta chips de betabel — seleccionados para hacerte la jornada más sabrosa.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E53E3E] text-white font-bold text-[.9rem] tracking-[.06em] uppercase hover:bg-[#FF5252] hover:shadow-[0_12px_30px_rgba(229,62,62,.35)] hover:-translate-y-0.5 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            Ver Menú
          </button>
          <button
            onClick={onWholesaleOpen}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-semibold text-[.9rem] tracking-[.06em] uppercase hover:border-white/30 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Oportunidad de Negocio
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 sm:gap-16 mt-16 flex-wrap">
          {[["16+", "Productos"], ["$15", "Desde"], ["10", "Puntos = Premio"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <span className="font-head text-[2.8rem] leading-none text-white block">{num}</span>
              <span className="text-[.72rem] text-white/30 uppercase tracking-[.12em] mt-1 block">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

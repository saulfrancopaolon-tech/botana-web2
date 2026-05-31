"use client"
import { useRef } from "react"

interface HeroProps {
  onMenuClick: () => void
  onWholesaleOpen: () => void
}

export function Hero({ onMenuClick, onWholesaleOpen }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)

  // Arreglo con los nombres exactos de tus imágenes
  // Asegúrate de que estos archivos .webp estén dentro de la carpeta "public" de tu proyecto
  const productImages = [
    "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", 
    "7.webp", "8.webp", "9.webp", "10.webp", "11.webp",
    "12.webp", "13.webp", "14.webp", "15.webp", "18.webp", 
    "19.webp", "69.webp", "70.webp", "71.webp", "72.webp"
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-[65vh] sm:min-h-[92vh] flex items-center justify-center text-center px-5 py-16 sm:py-24 overflow-hidden bg-[#0A0A0A]"
    >
      {/* Estilos inyectados para la animación infinita */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          /* 120s de velocidad porque ahora son muchas imágenes. Ajusta si lo sientes muy rápido/lento */
          animation: scroll-horizontal 120s linear infinite; 
        }
      `}} />

      {/* Background — CARRUSEL ANIMADO (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-90">
        <div className="animate-infinite-scroll flex h-full items-center">
          
          {/* GRUPO 1: Renderizado automático de tus 20 fotos */}
          {productImages.map((img, index) => (
            <img 
              key={`group1-${index}`} 
              src={`/${img}`} 
              alt={`Botana ${img}`} 
              className="h-full w-[300px] sm:w-[450px] object-cover" 
            />
          ))}
          
          {/* GRUPO 2: Duplicado exacto para crear el efecto de bucle infinito (loop) */}
          {productImages.map((img, index) => (
            <img 
              key={`group2-${index}`} 
              src={`/${img}`} 
              alt={`Botana ${img} duplicada`} 
              className="h-full w-[300px] sm:w-[450px] object-cover" 
            />
          ))}

        </div>
      </div>

      {/* FILTROS OVERLAYS (z-10) — Mantiene la legibilidad sin ser invasivo */}
      {/* Capa de desenfoque y oscurecimiento para fundir los fondos negros de las fotos con la web */}
      <div className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-blur-[6px] z-10" />
      
      {/* Degradado radial original para mantener la identidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(229,62,62,0.12)_0%,transparent_70%)] z-20" />

      {/* Contenido Principal (z-30) — Texto y Botones */}
      <div className="relative z-30 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 bg-[#E53E3E]/10 border border-[#E53E3E]/30 rounded-full px-4 py-1.5 text-[.72rem] font-bold tracking-[.15em] uppercase text-[#E53E3E] mb-5 sm:mb-7 animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E] pulse-dot" />
          Leon, Gto. · La Salle Bajio
        </div>

        {/* Headline */}
        <h1
          className="font-head text-[clamp(3.5rem,14vw,9rem)] leading-[.93] tracking-wide text-white mb-4 sm:mb-5 animate-fade-in-up drop-shadow-2xl"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          El Sabor<br />Que <span className="text-[#E53E3E]">Mueve</span>
        </h1>

        <p
          className="text-[clamp(.9rem,3vw,1.15rem)] text-white/70 max-w-[480px] mx-auto mb-8 sm:mb-10 font-light leading-relaxed animate-fade-in-up drop-shadow-md"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          Snacks irresistibles. Seleccionados para hacerte la jornada mas sabrosa.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "440ms", animationFillMode: "both" }}
        >
          <button
            onClick={onMenuClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E53E3E] text-white font-bold text-[.95rem] tracking-[.06em] uppercase transition-all shadow-[0_8px_24px_rgba(229,62,62,0.35)] hover:shadow-[0_12px_32px_rgba(229,62,62,0.45)] hover:-translate-y-0.5"
            style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
            </svg>
            Ver Menu Completo
          </button>
          <button
            onClick={onWholesaleOpen}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white font-semibold text-[.95rem] tracking-[.06em] uppercase hover:border-white/35 hover:-translate-y-0.5 transition-all bg-[#0A0A0A]/40 backdrop-blur-md"
            style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            Oportunidad de Negocio
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex justify-center gap-8 sm:gap-16 mt-12 sm:mt-16 flex-wrap animate-fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          {[["16+", "Productos"], ["$15", "Desde"], ["10pts", "Premio"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <span className="font-head text-[2.2rem] sm:text-[2.8rem] leading-none text-white block drop-shadow-md">
                {num}
              </span>
              <span className="text-[.68rem] text-white/60 uppercase tracking-[.12em] mt-1 block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

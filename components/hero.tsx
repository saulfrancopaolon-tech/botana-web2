"use client"
import { useEffect, useRef } from "react"
import type { Product } from "@/lib/products"
import { Ico } from "./icons"
import { ProductGallery } from "./product-gallery"

interface HeroProps {
  products: Product[]
  onMenuClick: () => void
  /** Al tocar un recuadro de la galería */
  onPickProduct: (p: Product) => void
}

export function Hero({ products, onMenuClick, onPickProduct }: HeroProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const galRef = useRef<HTMLDivElement>(null)

  // Parallax: al hacer scroll el texto sube y se desvanece, y la galería se encoge y se inclina
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const run = () => {
      raf = 0
      const y = window.scrollY
      const h = window.innerHeight * 0.9
      if (y > h * 1.3) return
      const p = Math.min(Math.max(y / h, 0), 1)
      if (textRef.current) {
        textRef.current.style.transform = "translate3d(0," + p * -70 + "px,0)"
        textRef.current.style.opacity = String(1 - p * 0.9)
      }
      if (galRef.current) {
        galRef.current.style.transform = "translate3d(0," + p * -40 + "px,0) scale(" + (1 - p * 0.08) + ") rotate(" + p * -2 + "deg)"
        galRef.current.style.opacity = String(1 - p * 0.55)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    window.addEventListener("scroll", onScroll, { passive: true })
    run()
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-10 sm:pt-16 sm:pb-20">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        {/* Texto */}
        <div ref={textRef} className="text-center will-change-transform lg:text-left">
          <div className="rise inline-flex items-center gap-2 rounded-full glass-2 px-4 py-1.5 text-[.72rem] font-semibold tracking-wide text-white/80" style={{ animationDelay: "40ms" }}>
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#30D158]" />
            Nuevo · Takis, Barcel, Vualá y Coca-Cola
          </div>

          <h1 className="rise font-head mt-6 text-[clamp(3.2rem,13vw,7rem)] text-grad-soft" style={{ animationDelay: "120ms", lineHeight: 0.95 }}>
            Snacks que
            <br />
            <span className="text-grad">rompen.</span>
          </h1>

          <p className="rise mx-auto mt-6 max-w-md text-[clamp(1rem,2.6vw,1.2rem)] leading-relaxed text-white/60 lg:mx-0" style={{ animationDelay: "220ms" }}>
            Tus botanas favoritas, a un toque. Pide por WhatsApp y recógelas en La Salle Bajío.
          </p>

          <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start" style={{ animationDelay: "320ms" }}>
            <button onClick={onMenuClick} className="btn-primary w-full sm:w-auto">
              Ver el menú <Ico name="arrowDown" size={16} strokeWidth={2.6} />
            </button>
            <a href="/b2b" className="btn-ghost w-full sm:w-auto">Compra por mayoreo</a>
          </div>
        </div>

        {/* Galería aleatoria de productos */}
        <div className="rise" style={{ animationDelay: "380ms" }}>
          <div ref={galRef} className="will-change-transform">
            <ProductGallery products={products} onPick={onPickProduct} />
          </div>
        </div>
      </div>
    </section>
  )
}

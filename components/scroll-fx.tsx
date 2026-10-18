"use client"
import { useEffect, useRef, useState } from "react"

/** Barra fina de progreso de scroll en la parte de arriba de la pantalla */
export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = bar.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      el.style.transform = "scaleX(" + p + ")"
      el.style.opacity = window.scrollY > 24 ? "1" : "0"
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]" aria-hidden="true">
      <span ref={bar} className="block h-full origin-left opacity-0 transition-opacity duration-300" style={{ transform: "scaleX(0)", background: "var(--grad-brand)", boxShadow: "0 0 12px rgba(255,59,48,.7)" }} />
    </div>
  )
}

/** Aparece suavemente (sube y crece un poco) cuando entra a la pantalla */
export function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) { setOn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={"sr " + (on ? "sr-in " : "") + className} style={{ transitionDelay: on ? delay + "ms" : "0ms" }}>
      {children}
    </div>
  )
}

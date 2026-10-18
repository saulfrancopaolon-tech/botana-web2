"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/** Productos que "caen" alrededor del logo: [archivo, x, y, rotación] */
const PACKS: [string, string, string, string][] = [
  ["takis-fuego", "-31vw", "-27vh", "-14deg"],
  ["vuala", "3vw", "-36vh", "6deg"],
  ["chips-jalapeno", "31vw", "-26vh", "13deg"],
  ["coca-cola", "-30vw", "28vh", "10deg"],
  ["takis-original", "-1vw", "37vh", "-6deg"],
  ["runners", "30vw", "27vh", "-12deg"],
]

const LETTERS = "BOTA-NA".split("")
const TOTAL_MS = 2650

/**
 * Animación de entrada: aparece "BOTA-NA" letra por letra, los productos caen
 * alrededor, una línea de carga se llena y el telón se abre en dos.
 * Se muestra una vez por sesión (no estorba si navegas entre páginas).
 */
export function Intro() {
  const pathname = usePathname()
  const skip = !!pathname && pathname.startsWith("/staff")
  const [alive, setAlive] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const finish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    const d = document.documentElement
    d.style.overflow = ""
    d.dataset.intro = "done"
    setAlive(false)
  }, [])

  useEffect(() => {
    if (skip) return
    const d = document.documentElement
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (d.dataset.intro === "done" || reduced) { finish(); return }
    d.style.overflow = "hidden" // sin scroll mientras corre la intro
    timer.current = setTimeout(finish, TOTAL_MS)
    return () => { if (timer.current) clearTimeout(timer.current); d.style.overflow = "" }
  }, [skip, finish])

  if (skip || !alive) return null

  return (
    <div className="bn-intro" aria-hidden="true" onClick={finish}>
      <div className="bn-curtain bn-curtain-top" />
      <div className="bn-curtain bn-curtain-bottom" />

      <div className="bn-stage">
        <div className="bn-glow" />

        {PACKS.map(([name, x, y, r], k) => (
          <span key={name} className="bn-pack" style={{ "--x": x, "--y": y, "--r": r, "--k": k } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={"/images/" + name + ".webp"} alt="" width={150} height={188} decoding="async" />
          </span>
        ))}

        <div className="bn-word font-head">
          {LETTERS.map((c, i) => (
            <span key={i} className={"bn-l" + (c === "-" ? " bn-dash" : "")}>
              <b style={{ "--i": i } as React.CSSProperties}>{c}</b>
            </span>
          ))}
        </div>

        <div className="bn-bar"><i /></div>
        <p className="bn-sub">Snacks que rompen</p>
      </div>
    </div>
  )
}

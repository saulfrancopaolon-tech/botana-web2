"use client"
import { useEffect, useRef, ReactNode, CSSProperties } from "react"

// ── useReveal ──────────────────────────────────────────────
// Adds .visible when element enters viewport
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            obs.unobserve(entry.target) // fire once
          }
        })
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}

// ── AnimateIn ──────────────────────────────────────────────
// Wraps any children with scroll-reveal
interface AnimateInProps {
  children: ReactNode
  className?: string
  stagger?: boolean
  delay?: number
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

export function AnimateIn({
  children,
  className = "",
  stagger = false,
  delay = 0,
  style,
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useReveal()

  const baseClass = stagger ? "reveal-stagger" : "reveal"
  const delayStyle = delay ? { transitionDelay: String(delay) + "ms" } : {}

  return (
    // @ts-ignore — dynamic tag
    <Tag
      ref={ref}
      className={baseClass + " " + className}
      style={{ ...style, ...delayStyle }}
    >
      {children}
    </Tag>
  )
}

// ── ScalePop ──────────────────────────────────────────────
// Pops in with spring scale on mount
interface ScalePopProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScalePop({ children, className = "", delay = 0 }: ScalePopProps) {
  return (
    <div
      className={"animate-scale-pop " + className}
      style={{ animationDelay: String(delay) + "ms", animationFillMode: "both" }}
    >
      {children}
    </div>
  )
}

// ── FadeIn ─────────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={"animate-fade-in " + className}
      style={{ animationDelay: String(delay) + "ms", animationFillMode: "both" }}
    >
      {children}
    </div>
  )
}

// ── SkeletonCard ───────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="rounded-[1.6rem] border border-white/5 overflow-hidden bg-[#111]">
      <div className="h-36 shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-3 rounded-full shimmer w-2/3" />
        <div className="h-2.5 rounded-full shimmer w-1/2" />
        <div className="h-2 rounded-full shimmer w-1/3 mt-3" />
      </div>
    </div>
  )
}

// ── PageTransition ─────────────────────────────────────────
// Wraps page content with fade-in on mount
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDuration: "0.4s", animationFillMode: "both" }}
    >
      {children}
    </div>
  )
}

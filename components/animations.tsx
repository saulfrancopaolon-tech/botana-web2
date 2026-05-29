"use client"
import React, { useEffect, useRef, ReactNode, CSSProperties } from "react"

// ── useReveal ──────────────────────────────────────────────
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            obs.unobserve(entry.target)
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
interface AnimateInProps {
  children: ReactNode
  className?: string
  stagger?: boolean
  delay?: number
  style?: CSSProperties
}

export function AnimateIn({
  children,
  className = "",
  stagger = false,
  delay = 0,
  style,
}: AnimateInProps) {
  const ref = useReveal()
  const baseClass = stagger ? "reveal-stagger" : "reveal"
  const delayStyle: CSSProperties = delay ? { transitionDelay: String(delay) + "ms" } : {}

  return (
    <div
      ref={ref}
      className={baseClass + " " + className}
      style={{ ...style, ...delayStyle }}
    >
      {children}
    </div>
  )
}

// ── ScalePop ──────────────────────────────────────────────
export function ScalePop({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
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

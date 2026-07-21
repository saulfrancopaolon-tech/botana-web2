"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

function CanjearContent() {
  const searchParams = useSearchParams()
  const codeFromUrl = (searchParams.get("code") || "").toUpperCase()

  const [usuarioIg, setUsuarioIg] = useState("")
  const [needsUser, setNeedsUser] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("botaNaUsername")
    if (saved) {
      setUsuarioIg(saved)
    } else {
      setNeedsUser(true)
    }
  }, [])

  useEffect(() => {
    if (usuarioIg && codeFromUrl) {
      redeem(usuarioIg)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioIg])

  const redeem = async (user: string) => {
    setStatus("loading")
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeFromUrl, usuario_ig: user }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "¡Punto agregado!")
        setPoints(data.puntos ?? null)
      } else {
        setStatus("error")
        setMessage(data.error || "No se pudo canjear el código.")
      }
    } catch {
      setStatus("error")
      setMessage("Error de conexión.")
    }
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = userInput.trim().toLowerCase().replace("@", "")
    if (clean.length < 3) return
    localStorage.setItem("botaNaUsername", clean)
    setUsuarioIg(clean)
    setNeedsUser(false)
  }

  if (!codeFromUrl) {
    return (
      <Screen>
        <XCircle className="h-12 w-12 text-red-400" />
        <p className="mt-4 text-center text-sm font-bold text-white">
          Este enlace no trae ningún código para canjear.
        </p>
        <BackLink />
      </Screen>
    )
  }

  if (needsUser) {
    return (
      <Screen>
        <p className="text-center text-xs font-black uppercase tracking-widest text-zinc-400">
          Antes, dinos tu usuario
        </p>
        <form onSubmit={handleUserSubmit} className="mt-4 w-full max-w-xs">
          <input
            type="text"
            autoFocus
            placeholder="@tu_usuario_de_instagram"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-bold text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={userInput.trim().length < 3}
            className="mt-3 w-full rounded-xl bg-white py-3 text-xs font-black uppercase text-black active:scale-95 disabled:opacity-50"
          >
            Continuar
          </button>
        </form>
      </Screen>
    )
  }

  if (status === "loading" || status === "idle") {
    return (
      <Screen>
        <Loader2 className="h-10 w-10 animate-spin text-white/50" />
        <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          Canjeando tu código...
        </p>
      </Screen>
    )
  }

  if (status === "success") {
    return (
      <Screen>
        <CheckCircle2 className="h-14 w-14 text-[#22c55e]" />
        <p className="mt-4 text-center text-lg font-black text-white">{message}</p>
        {points !== null && (
          <p className="mt-1 text-center text-sm font-bold text-zinc-400">
            Ahora tienes {points}/10 puntos
          </p>
        )}
        <BackLink />
      </Screen>
    )
  }

  return (
    <Screen>
      <XCircle className="h-14 w-14 text-red-400" />
      <p className="mt-4 text-center text-sm font-bold text-white">{message}</p>
      <BackLink />
    </Screen>
  )
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0907] p-6">
      {children}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/"
      className="mt-6 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase text-zinc-300 active:scale-95"
    >
      Ver mi tarjeta
    </Link>
  )
}

export default function CanjearPage() {
  return (
    <Suspense
      fallback={
        <Screen>
          <Loader2 className="h-10 w-10 animate-spin text-white/50" />
        </Screen>
      }
    >
      <CanjearContent />
    </Suspense>
  )
}

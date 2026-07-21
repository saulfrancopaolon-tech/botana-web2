"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Loader2, LogOut, QrCode, Search } from "lucide-react"

export function StaffGate({ children }: { children: React.ReactNode }) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinLoading, setPinLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetch("/api/staff/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false))
      .finally(() => setCheckingSession(false))
  }, [])

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinLoading(true)
    setPinError("")
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json()
      if (res.ok) {
        setAuthed(true)
        setPin("")
      } else {
        setPinError(data.error || "PIN incorrecto.")
      }
    } catch {
      setPinError("Error de conexión.")
    } finally {
      setPinLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/staff/logout", { method: "POST" }).catch(() => {})
    setAuthed(false)
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <form
          onSubmit={handlePinSubmit}
          className="w-full max-w-xs rounded-[2rem] border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        >
          <h1 className="text-center text-lg font-black uppercase tracking-tight text-white">
            Panel de Caja
          </h1>
          <p className="mt-1 text-center text-xs text-zinc-400">Ingresa el PIN de staff</p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-6 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-2xl tracking-[0.4em] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {pinError && (
            <p className="mt-3 text-center text-xs font-bold text-red-400">{pinError}</p>
          )}
          <button
            type="submit"
            disabled={pinLoading || !pin}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 py-4 font-black text-white active:scale-95 disabled:opacity-50"
          >
            {pinLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "ENTRAR"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          <Link
            href="/staff"
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${
              pathname === "/staff" ? "bg-white text-black" : "text-zinc-400"
            }`}
          >
            <Search className="h-3 w-3" /> Buscar
          </Link>
          <Link
            href="/staff/qr"
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${
              pathname === "/staff/qr" ? "bg-white text-black" : "text-zinc-400"
            }`}
          >
            <QrCode className="h-3 w-3" /> QR
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-300"
        >
          <LogOut className="h-3.5 w-3.5" /> Salir
        </button>
      </div>
      {children}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
  CheckCircle2,
  Loader2,
  LogOut,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  Undo2,
  UserPlus,
} from "lucide-react"

interface Customer {
  usuario_ig: string
  puntos: number
  is_verified: boolean
}

const CODE_TTL_SECONDS = 180

export default function StaffPage() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinLoading, setPinLoading] = useState(false)
  const [tab, setTab] = useState<"qr" | "search">("qr")

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Customer[]>([])

  // --- Estado de la pestaña QR / Código ---
  const [qrCode, setQrCode] = useState("")
  const [qrExpiresAt, setQrExpiresAt] = useState<number | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrUsedBy, setQrUsedBy] = useState<string | null>(null)
  const [qrSecondsLeft, setQrSecondsLeft] = useState(CODE_TTL_SECONDS)
  const [origin, setOrigin] = useState("")
  const [searching, setSearching] = useState(false)
  const [busyUser, setBusyUser] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch("/api/staff/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false))
      .finally(() => setCheckingSession(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(""), 2200)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (authed) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [authed])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(() => runSearch(query), 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin)
  }, [])

  // Genera un código nuevo automáticamente al entrar a la pestaña QR
  useEffect(() => {
    if (authed && tab === "qr" && !qrCode) {
      generateQrCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab])

  // Cuenta regresiva + auto-regenerar cuando expira
  useEffect(() => {
    if (!qrCode || qrUsedBy) return
    const interval = setInterval(() => {
      if (!qrExpiresAt) return
      const secondsLeft = Math.max(0, Math.round((qrExpiresAt - Date.now()) / 1000))
      setQrSecondsLeft(secondsLeft)
      if (secondsLeft <= 0) {
        generateQrCode()
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode, qrExpiresAt, qrUsedBy])

  // Sondea cada 2s si el cliente ya escaneó/canjeó el código
  useEffect(() => {
    if (!qrCode || qrUsedBy) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/staff/code-status?code=${qrCode}`)
        const data = await res.json()
        if (data.used) {
          setQrUsedBy(data.used_by || "cliente")
          setToast(`+1 punto a @${data.used_by} ✅`)
          setTimeout(() => generateQrCode(), 2500)
        }
      } catch {
        // silencioso: se reintenta en el siguiente ciclo
      }
    }, 2000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode, qrUsedBy])

  const generateQrCode = async () => {
    setQrLoading(true)
    setQrUsedBy(null)
    try {
      const res = await fetch("/api/staff/generate-code", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setQrCode(data.code)
        setQrExpiresAt(new Date(data.expiresAt).getTime())
        setQrSecondsLeft(CODE_TTL_SECONDS)
      } else {
        setToast(data.error || "Error al generar código")
      }
    } catch {
      setToast("Error de conexión")
    } finally {
      setQrLoading(false)
    }
  }

  const runSearch = async (q: string) => {
    setSearching(true)
    try {
      const res = await fetch(`/api/staff/customers?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.customers || [])
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

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

  const afterMutation = (customer: Customer, message: string) => {
    setResults((prev) =>
      prev.map((c) => (c.usuario_ig === customer.usuario_ig ? customer : c))
    )
    setToast(message)
  }

  const addPoint = async (usuario_ig: string) => {
    setBusyUser(usuario_ig)
    try {
      const res = await fetch("/api/staff/add-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_ig }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.created) {
          setQuery("")
          setResults([])
          setToast(`@${usuario_ig} creado con 1 punto ✅`)
        } else {
          afterMutation(data.customer, `+1 punto a @${usuario_ig} ✅`)
        }
      } else {
        setToast(data.error || "Error al sumar punto")
      }
    } catch {
      setToast("Error de conexión")
    } finally {
      setBusyUser(null)
      searchInputRef.current?.focus()
    }
  }

  const undoPoint = async (usuario_ig: string) => {
    setBusyUser(usuario_ig)
    try {
      const res = await fetch("/api/staff/undo-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_ig }),
      })
      const data = await res.json()
      if (res.ok) {
        afterMutation(data.customer, `Punto deshecho para @${usuario_ig}`)
      } else {
        setToast(data.error || "Error al deshacer")
      }
    } catch {
      setToast("Error de conexión")
    } finally {
      setBusyUser(null)
    }
  }

  const resetCard = async (usuario_ig: string) => {
    if (!window.confirm(`¿Reiniciar la tarjeta de @${usuario_ig} a 0 puntos?`)) return
    setBusyUser(usuario_ig)
    try {
      const res = await fetch("/api/staff/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_ig }),
      })
      const data = await res.json()
      if (res.ok) {
        afterMutation(data.customer, `Tarjeta de @${usuario_ig} reiniciada`)
      } else {
        setToast(data.error || "Error al reiniciar")
      }
    } catch {
      setToast("Error de conexión")
    } finally {
      setBusyUser(null)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cleanQuery = query.trim().toLowerCase().replace("@", "")
      if (results.length === 1) {
        addPoint(results[0].usuario_ig)
      } else if (results.length === 0 && cleanQuery.length >= 3 && !searching) {
        addPoint(cleanQuery)
      }
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0907]">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0907] p-4">
        <form
          onSubmit={handlePinSubmit}
          className="w-full max-w-xs rounded-[2rem] border border-white/10 bg-[#1A1209] p-6 shadow-2xl"
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
            className="mt-6 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-2xl tracking-[0.4em] text-white focus:outline-none focus:ring-2 focus:ring-[#E53E3E]"
          />
          {pinError && (
            <p className="mt-3 text-center text-xs font-bold text-red-400">{pinError}</p>
          )}
          <button
            type="submit"
            disabled={pinLoading || !pin}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#E53E3E] to-[#F97316] py-4 font-black text-white active:scale-95 disabled:opacity-50"
          >
            {pinLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "ENTRAR"}
          </button>
        </form>
      </div>
    )
  }

  const cleanQuery = query.trim().toLowerCase().replace("@", "")
  const showCreateNew =
    !searching && cleanQuery.length >= 3 && results.length === 0

  const qrMinutes = Math.floor(qrSecondsLeft / 60)
  const qrSeconds = qrSecondsLeft % 60
  const qrUrl = origin && qrCode ? `${origin}/canjear?code=${qrCode}` : ""

  return (
    <div className="min-h-screen bg-[#0D0907] pb-24">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0D0907]/95 backdrop-blur px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            Panel de Caja
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-300"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab("qr")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black uppercase transition-colors ${
              tab === "qr" ? "bg-white text-black" : "bg-white/5 text-zinc-400 border border-white/10"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" /> QR / Código
          </button>
          <button
            onClick={() => setTab("search")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black uppercase transition-colors ${
              tab === "search" ? "bg-white text-black" : "bg-white/5 text-zinc-400 border border-white/10"
            }`}
          >
            <Search className="h-3.5 w-3.5" /> Buscar
          </button>
        </div>

        {tab === "search" && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar por usuario de Instagram..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E53E3E]"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
            )}
          </div>
        )}
      </div>

      {tab === "qr" && (
        <div className="flex flex-col items-center px-4 py-8">
          {qrUsedBy ? (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
              <p className="mt-4 text-center text-sm font-black text-white">
                +1 punto a @{qrUsedBy}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                Generando el siguiente código...
              </p>
            </div>
          ) : qrCode ? (
            <>
              <div className="rounded-3xl bg-white p-5 shadow-2xl">
                {qrUrl ? (
                  <QRCodeSVG value={qrUrl} size={220} level="M" />
                ) : (
                  <div className="flex h-[220px] w-[220px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                )}
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                O escribe este código
              </p>
              <p className="mt-1 text-3xl font-black tracking-[0.3em] text-white">{qrCode}</p>

              <p className="mt-3 text-xs font-bold text-zinc-500">
                Expira en {qrMinutes}:{qrSeconds.toString().padStart(2, "0")}
              </p>

              <button
                onClick={generateQrCode}
                disabled={qrLoading}
                className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[10px] font-bold uppercase text-zinc-300 active:scale-95 disabled:opacity-50"
              >
                {qrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                Generar nuevo código
              </button>

              <p className="mt-8 max-w-xs text-center text-[10px] leading-relaxed text-zinc-600">
                El cliente escanea el QR con la cámara de su celular y su punto se suma solo.
                Si no puede escanear, dile el código de arriba para que lo escriba en su tarjeta.
              </p>
            </>
          ) : (
            <Loader2 className="mt-10 h-8 w-8 animate-spin text-white/40" />
          )}
        </div>
      )}

      {tab === "search" && (
      <div className="px-4 py-4 space-y-3">
        {results.map((c) => (
          <div
            key={c.usuario_ig}
            className="rounded-2xl border border-white/10 bg-[#1A1209] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">@{c.usuario_ig}</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {c.puntos}/10 puntos {c.is_verified ? "· Verificado" : "· Sin activar"}
                </p>
              </div>
              <button
                onClick={() => addPoint(c.usuario_ig)}
                disabled={busyUser === c.usuario_ig || c.puntos >= 10}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#F97316] to-[#E53E3E] px-4 py-3 text-xs font-black text-white active:scale-95 disabled:opacity-40"
              >
                {busyUser === c.usuario_ig ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> PUNTO
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => undoPoint(c.usuario_ig)}
                disabled={busyUser === c.usuario_ig || c.puntos <= 0}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 text-[10px] font-bold uppercase text-zinc-300 disabled:opacity-30"
              >
                <Undo2 className="h-3 w-3" /> Deshacer
              </button>
              <button
                onClick={() => resetCard(c.usuario_ig)}
                disabled={busyUser === c.usuario_ig}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 text-[10px] font-bold uppercase text-zinc-300 disabled:opacity-30"
              >
                <RotateCcw className="h-3 w-3" /> Reiniciar
              </button>
            </div>
          </div>
        ))}

        {showCreateNew && (
          <button
            onClick={() => addPoint(cleanQuery)}
            disabled={busyUser === cleanQuery}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 py-5 text-xs font-bold uppercase text-zinc-300 active:scale-95"
          >
            {busyUser === cleanQuery ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Crear @{cleanQuery} y sumar 1 punto
              </>
            )}
          </button>
        )}

        {query.trim().length < 2 && (
          <p className="mt-10 text-center text-xs text-zinc-600">
            Escribe al menos 2 letras del usuario de Instagram del cliente.
          </p>
        )}
      </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-xs font-black text-black shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  )
}

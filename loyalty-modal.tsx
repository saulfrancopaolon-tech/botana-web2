"use client"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

const WA = "524774950232"
const GA_URL = "https://script.google.com/macros/s/AKfycbwf8QjtB996ZjFQEpAkR6au-AmakyMEV4SDzEPefW5KGY7beCQd_CpigmgTD6S-w7qCwA/exec"

interface Props { isOpen: boolean; onClose: () => void }
type Screen = "login" | "verify" | "card" | "loading"

export function LoyaltyModal({ isOpen, onClose }: Props) {
  const [screen, setScreen] = useState<Screen>("login")
  const [username, setUsername] = useState("")
  const [inputVal, setInputVal] = useState("")
  const [points, setPoints] = useState(0)
  const [code, setCode] = useState("")
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [status, setStatus] = useState<{ msg: string; type: "ok" | "err" | "load" } | null>(null)
  const [error, setError] = useState("")
  const [igClicked, setIgClicked] = useState(false)
  const [activating, setActivating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  // Auto-login if session saved
  useEffect(() => {
    if (!isOpen) return
    const saved = localStorage.getItem("botaNaUser")
    if (saved) {
      doFetchUser(saved)
    } else {
      setScreen("login")
      setInputVal("")
      setError("")
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  async function doFetchUser(user: string) {
    const clean = user.trim().toLowerCase().replace(/^@/, "")
    if (!clean || clean.length < 2) {
      setError("Ingresa un usuario válido")
      setScreen("login")
      return
    }
    setError("")
    setScreen("loading")

    try {
      // Try to get existing user
      const { data: existing, error: fetchErr } = await supabase
        .from("clientes_leales")
        .select("*")
        .eq("usuario_ig", clean)
        .single()

      if (fetchErr && fetchErr.code !== "PGRST116") {
        // Real error (not "row not found")
        throw new Error(fetchErr.message)
      }

      if (existing) {
        setUsername(clean)
        setPoints(existing.puntos ?? 0)
        localStorage.setItem("botaNaUser", clean)
        setScreen(existing.is_verified ? "card" : "verify")
        return
      }

      // New user — insert
      const { data: newUser, error: insertErr } = await supabase
        .from("clientes_leales")
        .insert([{ usuario_ig: clean, puntos: 0, is_verified: false }])
        .select()
        .single()

      if (insertErr) throw new Error(insertErr.message)

      setUsername(clean)
      setPoints(0)
      localStorage.setItem("botaNaUser", clean)
      setScreen("verify")
    } catch (e: any) {
      console.error("Supabase error:", e)
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.")
      setScreen("login")
    }
  }

  async function activate() {
    if (!igClicked || activating) return
    setActivating(true)
    try {
      await supabase
        .from("clientes_leales")
        .update({ is_verified: true })
        .eq("usuario_ig", username)
      setScreen("card")
    } catch {
      // Even if update fails, let them in
      setScreen("card")
    } finally {
      setActivating(false)
    }
  }

  async function redeem() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed || redeemLoading) return
    setRedeemLoading(true)
    setStatus({ msg: "Verificando código...", type: "load" })

    try {
      const res = await fetch(GA_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: trimmed, usuario: username }),
        redirect: "follow",
      })
      const result = await res.json()

      if (result.success) {
        const np = points + 1
        await supabase
          .from("clientes_leales")
          .update({ puntos: np })
          .eq("usuario_ig", username)
        setPoints(np)
        setCode("")
        setStatus({ msg: "¡Punto agregado! 🎉", type: "ok" })
      } else {
        setStatus({ msg: result.message || "Código inválido o ya usado", type: "err" })
      }
    } catch {
      setStatus({ msg: "Error de red, intenta de nuevo", type: "err" })
    } finally {
      setRedeemLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("botaNaUser")
    setUsername("")
    setInputVal("")
    setPoints(0)
    setCode("")
    setStatus(null)
    setError("")
    setIgClicked(false)
    setScreen("login")
    setTimeout(() => inputRef.current?.focus(), 150)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* ── LOADING ── */}
        {screen === "loading" && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Cargando tu BOTA-Card...</p>
          </div>
        )}

        {/* ── LOGIN ── */}
        {screen === "login" && (
          <div className="pt-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎁</div>
              <h2 className="font-head text-[2rem] leading-none mb-1">Tu BOTA-Card</h2>
              <p className="text-white/40 text-sm">Ingresa tu usuario de Instagram</p>
            </div>

            <div className="space-y-3">
              <input
                ref={inputRef}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base outline-none focus:border-[#E53E3E] transition-colors font-mono text-center tracking-wider placeholder:text-white/20"
                placeholder="@tu_usuario"
                value={inputVal}
                onChange={e => { setInputVal(e.target.value); setError("") }}
                onKeyDown={e => { if (e.key === "Enter") doFetchUser(inputVal) }}
                autoComplete="off"
                autoCapitalize="none"
              />
              {error && (
                <p className="text-red-400 text-xs text-center font-bold px-2">{error}</p>
              )}
              <button
                onClick={() => doFetchUser(inputVal)}
                disabled={inputVal.trim().length < 2}
                className="w-full py-3.5 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-widest uppercase hover:bg-[#FF5252] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Entrar a mi tarjeta
              </button>
            </div>
          </div>
        )}

        {/* ── VERIFY ── */}
        {screen === "verify" && (
          <div className="pt-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">📱</div>
              <h2 className="font-head text-[2rem] leading-none mb-1">Activa tu Tarjeta</h2>
              <p className="text-white/40 text-sm">
                Hola <span className="text-white font-bold">@{username}</span>, síguenos para activar tus puntos
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://instagram.com/bota.na.mx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIgClicked(true)}
                className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl text-white font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.2"/>
                </svg>
                1. Ir a @bota.na.mx en Instagram
              </a>

              <button
                onClick={activate}
                disabled={!igClicked || activating}
                className={`w-full py-4 rounded-full font-black text-xs tracking-widest uppercase transition-all active:scale-95 ${
                  igClicked
                    ? "bg-[#E53E3E] text-white hover:bg-[#FF5252]"
                    : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {activating
                  ? "Activando..."
                  : igClicked
                  ? "2. ✓ Ya los sigo — Activar BOTA-Card"
                  : "2. (Primero visita Instagram)"}
              </button>
            </div>

            <button
              onClick={logout}
              className="mt-6 w-full text-xs text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
            >
              Cambiar usuario
            </button>
          </div>
        )}

        {/* ── CARD ── */}
        {screen === "card" && (
          <div className="pt-2">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🥜</div>
              <h2 className="font-head text-[2rem] leading-none mb-1">Mi BOTA-Card</h2>
              <p className="text-[.7rem] text-white/30 uppercase tracking-widest font-mono">@{username}</p>
            </div>

            {/* Points */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < points
                      ? "bg-[#E53E3E] text-white scale-105"
                      : "bg-white/5 border border-white/10 text-white/25"
                  }`}
                >
                  {i < points
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-white/25 mb-5">
              {points}/10 puntos ·{" "}
              {points >= 10 ? "¡Tarjeta completa!" : `${10 - points} puntos para tu snack gratis`}
            </p>

            {points >= 10 ? (
              <div className="rounded-2xl p-5 text-center mb-4" style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}>
                <p className="font-head text-[1.8rem] mb-3">🎉 ¡TARJETA LLENA!</p>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola! Llené mi BOTA-Card. Mi usuario es: @${username}. ¡Quiero mi premio!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#22c55e] text-white text-center py-3 rounded-full font-black text-xs tracking-widest uppercase hover:bg-[#16a34a] active:scale-95 transition-all"
                >
                  Reclamar por WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white/[.04] border border-white/[.06] rounded-2xl p-4 mb-4">
                <p className="text-[.65rem] font-black uppercase tracking-[.2em] text-white/30 text-center mb-3">
                  Código de Compra
                </p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm uppercase tracking-wider outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15"
                    placeholder="BOTA-XXXX"
                    maxLength={12}
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setStatus(null) }}
                    onKeyDown={e => { if (e.key === "Enter") redeem() }}
                    disabled={redeemLoading}
                  />
                  <button
                    onClick={redeem}
                    disabled={!code.trim() || redeemLoading}
                    className="px-4 py-2.5 rounded-xl bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-[#FBBF24] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {redeemLoading
                      ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin inline-block" />
                      : "Canjear"}
                  </button>
                </div>
                {status && (
                  <div className={`mt-3 py-2 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider ${
                    status.type === "ok"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : status.type === "err"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {status.msg}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={logout}
              className="w-full text-xs text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors py-1"
            >
              Cerrar sesión / Cambiar usuario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

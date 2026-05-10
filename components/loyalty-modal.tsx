"use client"
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

const WA = "524774950232"
const GA_URL = "https://script.google.com/macros/s/AKfycbwf8QjtB996ZjFQEpAkR6au-AmakyMEV4SDzEPefW5KGY7beCQd_CpigmgTD6S-w7qCwA/exec"

interface Props { isOpen: boolean; onClose: () => void }

type Screen = "login" | "verify" | "card" | "loading"

export function LoyaltyModal({ isOpen, onClose }: Props) {
  const [screen, setScreen] = useState<Screen>("login")
  const [username, setUsername] = useState("")
  const [points, setPoints] = useState(0)
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<{ msg: string; type: "ok" | "err" | "load" } | null>(null)
  const [igClicked, setIgClicked] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("botaNaUser")
      if (saved) fetchUser(saved)
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const fetchUser = useCallback(async (user: string) => {
    setScreen("loading")
    const clean = user.trim().toLowerCase().replace("@", "")
    try {
      let { data, error } = await supabase.from("clientes_leales").select("*").eq("usuario_ig", clean).single()
      if (error?.code === "PGRST116") {
        const { data: nd } = await supabase.from("clientes_leales").insert([{ usuario_ig: clean, puntos: 0, is_verified: false }]).select().single()
        data = nd
      }
      if (data) {
        setUsername(clean)
        setPoints(data.puntos)
        localStorage.setItem("botaNaUser", clean)
        setScreen(data.is_verified ? "card" : "verify")
      } else setScreen("login")
    } catch { setScreen("login") }
  }, [])

  const activate = async () => {
    if (!igClicked) return
    await supabase.from("clientes_leales").update({ is_verified: true }).eq("usuario_ig", username)
    setScreen("card")
  }

  const redeem = async () => {
    if (!code.trim()) return
    setStatus({ msg: "Verificando...", type: "load" })
    try {
      const res = await fetch(GA_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: code.trim().toUpperCase(), usuario: username }),
        redirect: "follow",
      })
      const result = await res.json()
      if (result.success) {
        const np = points + 1
        await supabase.from("clientes_leales").update({ puntos: np }).eq("usuario_ig", username)
        setPoints(np)
        setCode("")
        setStatus({ msg: "¡Punto agregado! 🎉", type: "ok" })
      } else {
        setStatus({ msg: result.message || "Código inválido o ya usado", type: "err" })
      }
    } catch { setStatus({ msg: "Error de conexión, intenta de nuevo", type: "err" }) }
  }

  const logout = () => {
    localStorage.removeItem("botaNaUser")
    setUsername(""); setPoints(0); setCode(""); setStatus(null); setIgClicked(false)
    setScreen("login")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-sm max-h-[88vh] overflow-y-auto p-6 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {screen === "loading" && (
          <div className="text-center py-10">
            <div className="spinner mx-auto mb-4" />
            <p className="text-white/40 text-sm">Cargando tu BOTA-Card...</p>
          </div>
        )}

        {screen === "login" && (
          <div className="text-center pt-4">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="font-head text-[2rem] mb-1">Tu BOTA-Card</h2>
            <p className="text-white/40 text-sm mb-6">Ingresa tu usuario de Instagram para ver tus puntos</p>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base outline-none focus:border-[#E53E3E] transition-colors mb-3 font-mono text-center"
              placeholder="@tu_usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && username.length >= 3) fetchUser(username) }}
            />
            <button
              onClick={() => username.length >= 3 && fetchUser(username)}
              disabled={username.length < 3}
              className="w-full py-3.5 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-widest uppercase hover:bg-[#FF5252] transition-all disabled:opacity-30"
            >
              Entrar
            </button>
          </div>
        )}

        {screen === "verify" && (
          <div className="text-center pt-4">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="font-head text-[2rem] mb-1">Activa tu Tarjeta</h2>
            <p className="text-white/40 text-sm mb-6">Hola @{username}, síguenos en Instagram para activar.</p>
            <div className="space-y-3">
              <a
                href="https://instagram.com/bota.na.mx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setIgClicked(true); setTimeout(() => {}, 1500) }}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black text-xs tracking-widest uppercase"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                1. Seguir @bota.na.mx en Instagram
              </a>
              <button
                onClick={activate}
                disabled={!igClicked}
                className="w-full py-3.5 rounded-full bg-[#E53E3E] text-white font-black text-xs tracking-widest uppercase hover:bg-[#FF5252] transition-all disabled:opacity-25"
              >
                2. Ya los sigo — Activar Tarjeta
              </button>
            </div>
            <button onClick={logout} className="mt-5 text-xs text-white/20 uppercase tracking-widest hover:text-white/50 transition-colors">Cambiar usuario</button>
          </div>
        )}

        {screen === "card" && (
          <div className="pt-2">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🥜</div>
              <h2 className="font-head text-[2rem] leading-none mb-1">Mi BOTA-Card</h2>
              <p className="text-[.7rem] text-white/25 uppercase tracking-widest font-mono">@{username}</p>
            </div>

            {/* Points grid */}
            <div className="grid grid-cols-5 gap-2 my-5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    i < points
                      ? "bg-[#E53E3E] text-white shadow-[0_0_10px_rgba(229,62,62,.35)] scale-105"
                      : "bg-white/5 border border-white/10 text-white/20"
                  }`}
                >
                  {i < points
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1
                  }
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-white/25 mb-5">
              {points}/10 puntos · {points >= 10 ? "¡Tarjeta completa!" : `${10 - points} puntos para tu snack gratis`}
            </p>

            {points >= 10 ? (
              <div className="bg-gradient-to-br from-[#F97316] to-[#E53E3E] rounded-2xl p-4 text-center">
                <p className="font-head text-[1.6rem] mb-3">🎉 ¡TARJETA LLENA!</p>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola! Llené mi BOTA-Card. Mi usuario es: @${username}. ¡Quiero mi premio!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#22c55e] text-white text-center py-3 rounded-full font-black text-xs tracking-widest uppercase hover:bg-[#16a34a] transition-colors"
                >
                  Reclamar por WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white/[.04] border border-white/[.06] rounded-2xl p-4">
                <p className="text-[.68rem] font-black uppercase tracking-[.2em] text-white/30 text-center mb-3">Código de Compra</p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm uppercase tracking-wider outline-none focus:border-[#F97316] transition-colors"
                    placeholder="BOTA-XXXX"
                    maxLength={12}
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setStatus(null) }}
                    onKeyDown={e => { if (e.key === "Enter") redeem() }}
                  />
                  <button
                    onClick={redeem}
                    disabled={!code.trim()}
                    className="px-4 py-2.5 rounded-xl bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-[#FBBF24] transition-all disabled:opacity-30"
                  >
                    Canjear
                  </button>
                </div>
                {status && (
                  <div className={`mt-3 py-2 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider ${
                    status.type === "ok" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : status.type === "err" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {status.msg}
                  </div>
                )}
              </div>
            )}

            <button onClick={logout} className="mt-5 w-full text-xs text-white/20 uppercase tracking-widest hover:text-white/50 transition-colors py-1">Cerrar sesión / Cambiar usuario</button>
          </div>
        )}
      </div>
    </div>
  )
}

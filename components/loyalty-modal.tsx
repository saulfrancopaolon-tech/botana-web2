"use client"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

const WA = "524774950232"
const GA_URL = "https://script.google.com/macros/s/AKfycbxOzao3kwRxI_sSiGbsgNXxgCYwbqfMcAlDF1NzyQ77FeL0bKb3fBS3GygUZD3IAZZC8A/exec"
const STORAGE_KEY = "botana_card"

interface LocalCard {
  username: string
  points: number
  verified: boolean
  usedCodes: string[]
}

function loadCard(): LocalCard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCard(card: LocalCard) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(card))
  } catch {}
}

function clearCard() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

async function fetchRemoteCard(username: string): Promise<{ points: number; verified: boolean } | null> {
  if (!supabase) {
    console.warn("[BOTANA] Supabase no esta configurado - revisa las variables de entorno")
    return null
  }
  try {
    console.log("[BOTANA] Buscando usuario en Supabase:", username)
    const { data, error } = await supabase
      .from("clientes_leales")
      .select("puntos, is_verified")
      .eq("usuario_ig", username)
      .single()
    if (error) {
      console.warn("[BOTANA] Error al leer Supabase:", error.code, error.message)
      return null
    }
    if (!data) {
      console.log("[BOTANA] Usuario no encontrado en Supabase")
      return null
    }
    const row = data as { puntos: number; is_verified: boolean }
    console.log("[BOTANA] Usuario encontrado - puntos:", row.puntos, "verificado:", row.is_verified)
    return { points: row.puntos ?? 0, verified: row.is_verified ?? false }
  } catch (e) {
    console.error("[BOTANA] Excepcion al leer Supabase:", e)
    return null
  }
}

async function upsertToSupabase(card: LocalCard) {
  if (!supabase) return
  try {
    console.log("[BOTANA] Guardando en Supabase:", card.username, "puntos:", card.points)
    const { error } = await supabase
      .from("clientes_leales")
      .upsert(
        { usuario_ig: card.username, puntos: card.points, is_verified: card.verified },
        { onConflict: "usuario_ig" }
      )
    if (error) {
      console.warn("[BOTANA] Error al guardar en Supabase:", error.code, error.message)
    } else {
      console.log("[BOTANA] Guardado en Supabase OK")
    }
  } catch (e) {
    console.error("[BOTANA] Excepcion al guardar en Supabase:", e)
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Screen = "login" | "verify" | "card" | "loading"

export function LoyaltyModal({ isOpen, onClose }: Props) {
  const [screen, setScreen] = useState<Screen>("login")
  const [card, setCard] = useState<LocalCard | null>(null)
  const [inputVal, setInputVal] = useState("")
  const [inputError, setInputError] = useState("")
  const [igClicked, setIgClicked] = useState(false)
  const [code, setCode] = useState("")
  const [codeStatus, setCodeStatus] = useState<{ msg: string; type: "ok" | "err" | "load" } | null>(null)
  const [codeLoading, setCodeLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const saved = loadCard()
    if (saved) {
      setCard(saved)
      setScreen(saved.verified ? "card" : "verify")
      fetchRemoteCard(saved.username).then(remote => {
        if (remote !== null && remote.points > saved.points) {
          console.log("[BOTANA] Sincronizando puntos remotos:", remote.points, ">", saved.points)
          const updated = { ...saved, points: remote.points, verified: remote.verified }
          setCard(updated)
          saveCard(updated)
        }
      })
    } else {
      setScreen("login")
      setInputVal("")
      setInputError("")
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  async function handleLogin() {
    const clean = inputVal.trim().toLowerCase().replace(/^@/, "")
    if (clean.length < 2) {
      setInputError("Ingresa un usuario valido")
      return
    }
    setInputError("")
    setScreen("loading")

    const remote = await fetchRemoteCard(clean)

    if (remote) {
      const restoredCard: LocalCard = {
        username: clean,
        points: remote.points,
        verified: remote.verified,
        usedCodes: [],
      }
      setCard(restoredCard)
      saveCard(restoredCard)
      setScreen(remote.verified ? "card" : "verify")
    } else {
      const newCard: LocalCard = { username: clean, points: 0, verified: false, usedCodes: [] }
      setCard(newCard)
      saveCard(newCard)
      setScreen("verify")
    }
  }

  function handleActivate() {
    if (!card || !igClicked) return
    const updated = { ...card, verified: true }
    setCard(updated)
    saveCard(updated)
    setScreen("card")
    upsertToSupabase(updated)
  }

  async function handleRedeem() {
    if (!card || !code.trim() || codeLoading) return
    const trimmed = code.trim().toUpperCase()
    
    if (card.usedCodes.includes(trimmed)) {
      setCodeStatus({ msg: "Este codigo ya fue usado", type: "err" })
      return
    }
    
    setCodeLoading(true)
    setCodeStatus({ msg: "Verificando...", type: "load" })
    
    try {
      const res = await fetch(GA_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: trimmed, usuario: card.username }),
        redirect: "follow",
      })
  
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`)
      }
  
      const textResult = await res.text()
      let result: { success: boolean; message?: string }
      
      try {
        result = JSON.parse(textResult)
      } catch (parseError) {
        console.error("[BOTANA] Google no devolvió JSON válido:", textResult)
        throw new Error("Respuesta inválida del servidor")
      }
  
      if (result.success) {
        const updated: LocalCard = {
          ...card,
          points: card.points + 1,
          usedCodes: [...card.usedCodes, trimmed],
        }
        setCard(updated)
        saveCard(updated)
        setCode("")
        setCodeStatus({ msg: "+1 punto agregado!", type: "ok" })
        upsertToSupabase(updated)
      } else {
        setCodeStatus({ msg: result.message || "Codigo invalido o ya usado", type: "err" })
      }
    } catch (error) {
      console.error("[BOTANA] Error en handleRedeem:", error)
      setCodeStatus({ msg: "Fallo de conexión. Intenta de nuevo.", type: "err" })
    } finally {
      setCodeLoading(false)
    }
  }

  function handleLogout() {
    clearCard()
    setCard(null)
    setInputVal("")
    setInputError("")
    setCode("")
    setCodeStatus(null)
    setIgClicked(false)
    setScreen("login")
    setTimeout(() => inputRef.current?.focus(), 200)
  }

  if (!isOpen) return null

  function renderLoading() {
    return (
      <div className="py-16 text-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Buscando tu tarjeta...</p>
      </div>
    )
  }

  function renderLogin() {
    return (
      <div className="pt-3">
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">🎁</div>
          <h2 className="font-head text-[2rem] leading-none mb-1">Tu BOTA-Card</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Acumula puntos con cada compra.
            <br />
            10 puntos = 1 snack gratis
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
              Usuario de Instagram
            </label>
            <input
              ref={inputRef}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base outline-none focus:border-[#E53E3E] transition-colors font-mono text-center tracking-widest placeholder:text-white/15"
              placeholder="@tu_usuario"
              value={inputVal}
              onChange={e => {
                setInputVal(e.target.value)
                setInputError("")
              }}
              onKeyDown={e => {
                if (e.key === "Enter") handleLogin()
              }}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
            {inputError && (
              <p className="text-red-400 text-xs mt-1.5 text-center">{inputError}</p>
            )}
          </div>
          <button
            onClick={handleLogin}
            disabled={inputVal.trim().length < 2}
            className="w-full py-4 rounded-full bg-[#E53E3E] text-white font-black text-sm tracking-widest uppercase hover:bg-[#FF5252] transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Entrar a mi tarjeta
          </button>
        </div>
      </div>
    )
  }

  function renderVerify() {
    if (!card) return null
    const igBtnLabel = igClicked ? "Visitado!" : "1. Ir a @bota.na.mx"
    const activateBtnLabel = igClicked ? "2. Activar BOTA-Card" : "2. Primero visita Instagram"
    const activateClass = igClicked
      ? "w-full py-4 rounded-full font-black text-sm tracking-widest uppercase bg-[#E53E3E] text-white hover:bg-[#FF5252] transition-all"
      : "w-full py-4 rounded-full font-black text-sm tracking-widest uppercase bg-white/5 border border-white/10 text-white/25 cursor-not-allowed transition-all"
    return (
      <div className="pt-3">
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">📱</div>
          <h2 className="font-head text-[2rem] leading-none mb-1">Activa tu Tarjeta</h2>
          <p className="text-white/40 text-sm">
            {"Hola @" + card.username + ", siguenos en Instagram para activar tus puntos"}
          </p>
        </div>
        <div className="space-y-3">
          <a
            href="https://instagram.com/bota.na.mx"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIgClicked(true)}
            className="flex items-center justify-center gap-2.5 w-full px-5 py-4 rounded-2xl text-white font-black text-xs tracking-widest uppercase hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>
            {igBtnLabel}
          </a>
          <button
            onClick={handleActivate}
            disabled={!igClicked}
            className={activateClass}
          >
            {activateBtnLabel}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full text-xs text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
        >
          Cambiar usuario
        </button>
      </div>
    )
  }

  function renderCard() {
    if (!card) return null
    const ptsleft = 10 - card.points
    const progressLabel = card.points >= 10
      ? "Tarjeta completa!"
      : "Faltan " + String(ptsleft) + " puntos"
    const waText = "Hola! Llene mi BOTA-Card. Usuario IG: @" + card.username + ". Quiero mi snack gratis!"
    const waHref = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText)
    let statusClass = "mt-3 py-2.5 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
    if (codeStatus) {
      if (codeStatus.type === "ok") {
        statusClass = "mt-3 py-2.5 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20"
      } else if (codeStatus.type === "err") {
        statusClass = "mt-3 py-2.5 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20"
      }
    }
    return (
      <div className="pt-2">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🥜</div>
          <h2 className="font-head text-[2rem] leading-none mb-1">Mi BOTA-Card</h2>
          <p className="text-[.68rem] text-white/25 uppercase tracking-[.15em] font-mono">
            {"@" + card.username}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {[0,1,2,3,4,5,6,7,8,9].map(i => {
            const filled = i < card.points
            const dotClass = filled
              ? "aspect-square rounded-full flex items-center justify-center text-xs font-bold bg-[#E53E3E] text-white scale-105 transition-all duration-300"
              : "aspect-square rounded-full flex items-center justify-center text-xs font-bold bg-white/5 border border-white/10 text-white/20 transition-all duration-300"
            return (
              <div key={i} className={dotClass}>
                {filled ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-xs text-white/25 mb-5 font-mono">
          {String(card.points) + "/10 - " + progressLabel}
        </p>
        {card.points >= 10 ? (
          <div
            className="rounded-2xl p-5 text-center mb-4"
            style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}
          >
            <p className="font-head text-[1.8rem] mb-3">TARJETA LLENA!</p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#22c55e] text-white text-center py-3.5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-[#16a34a] transition-all"
            >
              Reclamar por WhatsApp
            </a>
          </div>
        ) : (
          <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4 mb-4">
            <p className="text-[.65rem] font-black uppercase tracking-[.2em] text-white/25 text-center mb-3">
              Canjear codigo de compra
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm uppercase tracking-wider outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15 disabled:opacity-50"
                placeholder="BOTA-XXXX"
                maxLength={12}
                value={code}
                onChange={e => {
                  setCode(e.target.value.toUpperCase())
                  setCodeStatus(null)
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") handleRedeem()
                }}
                disabled={codeLoading}
              />
              <button
                onClick={handleRedeem}
                disabled={!code.trim() || codeLoading}
                className="px-4 py-3 rounded-xl bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-[#FBBF24] transition-all disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {codeLoading ? (
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin block" />
                ) : (
                  "OK"
                )}
              </button>
            </div>
            {codeStatus && (
              <div className={statusClass}>
                {codeStatus.msg}
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-xs text-white/15 uppercase tracking-widest hover:text-white/35 transition-colors py-1"
        >
          Cerrar sesion
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {screen === "loading" && renderLoading()}
        {screen === "login" && renderLogin()}
        {screen === "verify" && renderVerify()}
        {screen === "card" && renderCard()}
      </div>
    </div>
  )
}
